from fastapi import FastAPI, UploadFile, File, Form
from typing import List
from pydantic import BaseModel #데이터 유효성 검사, 설정관리 라이브러리
import io # 파일 입출력
import base64
from PIL import Image # 이미지 처리 라이브러리
import numpy as np # 배열 및 행렬 연산 라이브러리
from ultralytics import YOLO # 객체 탐지
import cv2 # 컴퓨터 비전 작업 라이브러리

# POST 요청을 통해 이미지가 전송되면 인공지능 객체 탐지 모델을 이용해서 객체를 탐지하고 그 결과 이미지를 base64 인코딩된 문자열로 반환하는 서비스 구현

# 서버 구동 명령어 python -m uvicorn main:app --reload

# 설치해야 하는 라이브러리
# conda install uvicorn
# pip install fastapi uvicorn pydantic Pillow numpy
# pip install ultralytics opencv-python requests

app = FastAPI()

model = YOLO('yolov8n.pt') # YOLOv8 모델 로드

class DetectionResult(BaseModel):
    message : str
    image : str
    detected_objects: str

# 테스트용 코드
@app.get("/")
async def read_root():
    return {"message" : "Helo FastAPI"}

def detect_objects(image: Image):
    img = np.array(image) # 이미지를 numpy 배열로 변환
    results = model(img) # 객체 탐지
    class_names = model.names # 클래스 이름 저장
    detected_objects = "" # 감지된 객체 이름을 저장할 리스트

    for ts in results[0].boxes.cls:
        if ts == 0.:
            detected_objects += "사람,"
        elif ts == 1.:
            detected_objects += "자전거,"
        elif ts == 15.:
            detected_objects += "고양이,"
        elif ts == 16.:
            detected_objects += "개,"
        elif ts in [24., 26., 28.]:
            detected_objects += "가방,"
        elif ts == 25.:
            detected_objects += "우산,"
        elif ts == 32.:
            detected_objects += "공,"
        elif ts == 34.:
            detected_objects += "야구배트,"
        elif ts == 35.:
            detected_objects += "야구 글러브,"
        elif ts == 36.:
            detected_objects += "스케이트보드,"
        elif ts == 38.:
            detected_objects += "테니스 라켓,"
        elif ts == 39.:
            detected_objects += "병,"
        elif ts == 40.:
            detected_objects += "와인잔,"
        elif ts == 41.:
            detected_objects += "컵,"
        elif ts == 42.:
            detected_objects += "포크,"
        elif ts == 43.:
            detected_objects += "나이프,"
        elif ts == 44.:
            detected_objects += "숟가락,"
        elif ts == 45.:
            detected_objects += "그릇,"
        elif ts == 56.:
            detected_objects += "의자,"
        elif ts == 63.:
            detected_objects += "노트북,"
        elif ts == 64.:
            detected_objects += "마우스,"
        elif ts == 66.:
            detected_objects += "키보드,"
        elif ts == 67.:
            detected_objects += "휴대폰,"
        elif ts == 70.:
            detected_objects += "토스터,"
        elif ts == 73.:
            detected_objects += "책,"
        elif ts == 74.:
            detected_objects += "시계,"
        elif ts == 76.:
            detected_objects += "가위,"
        elif ts == 77.:
            detected_objects += "테디베어,"
        elif ts == 78.:
            detected_objects += "헤어드라이어,"

    # 결과를 바운딩 박스와 정확도로 이미지에 표시
    for result in results:
        boxes = result.boxes.xyxy # 바운딩 박스
        confidences = result.boxes.cls # 신뢰도
        class_ids = result.boxes.cls # 클래스
        for box, confidence, class_id in zip(boxes, confidences, class_ids):
            x1, y1, x2, y2 = map(int, box) # 좌표를 정수로 변환
            label = class_names[int(class_id)] # 클래스 이름
            cv2.rectangle(img, (x1, y1), (x2, y2), (255,0,0), 2)
            cv2.putText(img, f'{label} {confidence:.2f}', (x1, y1), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)

    result_image = Image.fromarray(img) # 결과 이미지를 PIL로 변환
    return result_image, detected_objects

@app.post("/detect", response_model=DetectionResult)
async def detect_service(message: str = Form(...), file: UploadFile = File(...)):
    # 이미지를 읽어서 PIL 이미지로 변환
    image = Image.open(io.BytesIO(await file.read()))

    # 이미지 알파 채널 제거하고 RGB로 변환
    if image.mode == 'RGBA':
        image = image.convert('RGB')
    elif image.mode != 'RGB':
        image = image.convert('RGB')

    # 객체 탐지 수행 (detect_objects 함수 호출)
    result_image, detected_objects = detect_objects(image)

    # 이미지 결과를 base64로 인코딩
    buffered = io.BytesIO()
    result_image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode("UTF-8")

    # 메시지와 인코딩된 이미지를 JSON 응답으로 반환
    return DetectionResult(message=message, image=img_str, detected_objects=detected_objects)

# 애플리케이션 실행을 위한 정의
if __name__ == "__name__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


