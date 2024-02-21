import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBDiningCommonsMenuItemForm from 'main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemEditPage({storybook=false}) {
    let { id } = useParams();

    const { data: menu, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/ucsbdiningcommonsmenuitems?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/ucsbdiningcommonsmenuitems`,
                params: {
                    id
                }
            }
        );

    const objectToAxiosPutParams = (menu) => ({
        url: "/api/ucsbdiningcommonsmenuitems",
        method: "PUT",
        params: {
            id: menu.id,
        },
        data: {
            name: menu.name,
            station: menu.station,
            diningCommonsCode: menu.diningCommonsCode
        }
    });

    const onSuccess = (menu) => {
        toast(`UCSBDiningCommonsMenuItem Updated - id: ${menu.id} name: ${menu.name} station: ${menu.station} diningCommonsCode: ${menu.diningCommonsCode}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/diningcommonsmenuitem?id=${id}`]
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
                <h1>Edit UCSB Dining Commons Menu Item</h1>
                {
                    menu && <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={menu} />
                }
            </div>
        </BasicLayout>
    )

}