import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemCreatePage({storybook=false}) {

    const objectToAxiosParams = (menu) => ({
        url: "/api/ucsbdiningcommonsmenuitems/post",
        method: "POST",
        params: {
         name: menu.name,
         diningCommonsCode: menu.diningCommonsCode,
         station: menu.station
        }
      });
    
      const onSuccess = (menu) => {
        toast(`New menu Created - id: ${menu.id} name: ${menu.name} diningCommonsCode: ${menu.diningCommonsCode} station: ${menu.station}`);
      }
    
      const mutation = useBackendMutation(
        objectToAxiosParams,
         { onSuccess }, 
         // Stryker disable next-line all : hard to set up test for caching
         ["/api/ucsbdiningcommonsmenuitems/all"] // mutation makes this key stale so that pages relying on it reload
         );
    
      const { isSuccess } = mutation
    
      const onSubmit = async (data) => {
        mutation.mutate(data);
      }
    
      if (isSuccess && !storybook) {
        return <Navigate to="/diningcommonsmenuitem" />
      }
    
      return (
        <BasicLayout>
          <div className="pt-2">
            <h1>Create New UCSBDiningCommons Menu Item</h1>
            <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} />
          </div>
        </BasicLayout>
      )
}
