import APIAlert from "@/app/_components/API-Alert";
import ClientSetting from "@/app/_components/ClientSetting";
import domin from "@/lib/domin";

const SettingPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { storeId } = await params;

  return (
    <div>
      Settig Your store
      <ClientSetting />{" "}
      <div>
        <APIAlert
          description={`${domin}/api/store/${storeId}`}
          title="NEXT_Private_API_URL to get store info & update & delete"
          variant="admin"
        />
      </div>
    </div>
  );
};

export default SettingPage;
//to do install tanStack to handle the rabite api .
