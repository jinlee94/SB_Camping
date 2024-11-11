import BasicLayout from "../../layouts/BasicLayout";
import CommunityMenu from "../../layouts/CommunityMenu";
import { Outlet, useNavigate } from "react-router-dom";
import { useCallback } from "react";

const CamperIndexPage = () => {
  const navigate = useNavigate();

  const handleClickList = useCallback(() => {
    navigate({ pathname: "list" });
  });
  const handleClickAdd = useCallback(() => {
    navigate({ pathname: "add" });
  });

  return (
    <BasicLayout>
      <CommunityMenu />
      <div>
        <Outlet />
      </div>
    </BasicLayout>
  );
};
export default CamperIndexPage;
