import {Button} from "react-bootstrap";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const LostItemAddPage = () => {

    const [detectedObject, setDetectedObject] = useState([]);
    const [lostItem, setLostItem] = useState({
        category : '',
        foundLocation : '',
        description : '',
        itemImage : '',
    });
    const navigate = useNavigate();


    /*
    *
    * 이미지 분석 비동기 요청 메소드 시작
    *
    * */
    const HandleRequestIA = () => {
        const button = document.querySelector("input[type=button]");
        const form = document.getElementById('fileUploadForm');
        const formData = new FormData(form);
        button.disabled = true;

        const xhr = new XMLHttpRequest()
        xhr.open("POST", "http://localhost:8080/java_service", true);
        xhr.onload = function () {
            // 처리 성공하면 img 출력
            if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                const objects = response.detected_objects; // 인식된 객체
                setDetectedObject(objects)
                const resultDiv = document.getElementById("result");
                // 이미지 분석 결과 : objects
                resultDiv.innerHTML = response.message + " : " + objects + " <br>";

                // img 태그 생성
                const img_src = "data:image/jpeg;base64," + response.image;
                const img = document.createElement("img");
                img.src = img_src;
                resultDiv.appendChild(img);

                button.disabled = false;

            } else {
                console.error("ERROR : " + xhr.statusText);
                button.disabled = false;
            }
        }
        xhr.onerror = function () {
            console.error("ERROR: " + xhr.statusText);
            button.disabled = false;
        }
        xhr.send(formData);
    }
    /*
    *
    * 이미지 분석 비동기 요청 메소드 끝
    *
    * */

    // 저장하기 버튼 클릭
    function handleSaveButton() {
        lostItem.category = detectedObject;
        console.log('lostItem :', lostItem)
        const fileInput = document.getElementById('file');
        const file = fileInput.files[0]
        const formData = new FormData();
        console.log("file : ", file, "category : ", lostItem.category)
        formData.append("file", file)
        formData.append("category", lostItem.category);
        formData.append("foundLocation", lostItem.foundLocation);
        formData.append("description", lostItem.description);

        if(!file){
            alert('이미지 파일을 등록해주세요')
            return;
        }

        if (!lostItem.category || lostItem.category.length === 0) {
            alert('이미지 파일 비동기 요청을 해주세요');
            return;
        }

        if(lostItem.foundLocation === ''){
            alert('습득 장소를 입력해주세요.')
            return;
        }

        saveLostItem(formData)

    }

    const saveLostItem = async (formData) => {
        const header = {
            headers:{'Content-Type': 'multipart/form-data'}
        }
        let result = await axios.post(`http://localhost:8080/api/lost/`, formData, header);
        console.log('result :', result);
        alert(result.data.itemId + '번 분실물 등록 완료!')
        navigate('/lost/list')
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLostItem((prevParams) => ({
            ...prevParams,
            [name]: value,
        }));

    }

    return(
        <div>
            <h1>분실물 이미지 분석</h1>
            <hr/>
            <form method="post" encType="multipart/form-data" id="fileUploadForm" className="mt-5 mb-5">
                <p><input type="hidden" name="message" value="이미지 분석 결과"/></p>
                <p>파일 : <input type="file" name="file" id="file"/></p>
                <input type="button" onClick={HandleRequestIA} value="이미지 분석 실행" style={{
                    border: '1px solid orange',
                    borderRadius: '5px',
                    backgroundColor: 'orange',
                    padding: '5px',
                }}/>
            </form>
            <hr/>
            <div id="result" style={{maxWidth: '500px'}} className="mt-5 mb-5">
                이미지 파일 첨부 후 분석 실행 버튼을 눌러주세요
            </div>
            <hr/>
            <div className="mt-5">

                <p>습득 장소* : <input type="text" name="foundLocation" className="border-1" onChange={handleChange}/></p>
                <p>추가 설명(선택) : <input type="text" maxLength='255' name="description" className="border-1"
                                      onChange={handleChange}/></p>
                <Button size="sm" variant="primary" onClick={handleSaveButton}>저장하기</Button>
            </div>
        </div>
    )
}

export default LostItemAddPage;