import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import HelpRequestForm from 'main/components/HelpRequest/HelpRequestForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestEditPage({storybook=false}) {

  let { id } = useParams();
  const { data: HelpRequest, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/helprequests?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/helprequests`,
        params: {
          id
        }
      }
    );

    const objectToAxiosPutParams = (HelpRequest) => ({
      url: "/api/helprequests",
      method: "PUT",
      params: {
        id: HelpRequest.id,
      },
      data: {
        requesterEmail: HelpRequest.requesterEmail,
        teamId: HelpRequest.teamId,
        tableOrBreakoutRoom: HelpRequest.tableOrBreakoutRoom,
        requestTime: HelpRequest.requestTime,
        explanation: HelpRequest.explanation,
        solved: HelpRequest.solved,
      }
    });
  
    const onSuccess = (HelpRequest) => {
      toast(`Help Request Updated - id: ${HelpRequest.id} email: ${HelpRequest.requesterEmail}`);
    }
  
    const mutation = useBackendMutation(
      objectToAxiosPutParams,
      { onSuccess },
      // Stryker disable next-line all : hard to set up test for caching
      [`/api/helprequests?id=${id}`]
    );
  
    const { isSuccess } = mutation
  
    const onSubmit = async (data) => {
      mutation.mutate(data);
    }
  
    if (isSuccess && !storybook) {
      return <Navigate to="/helprequests" />
    }
  
    return (
      <BasicLayout>
        <div className="pt-2">
          <h1>Edit Help Request</h1>
          {
            HelpRequest && <HelpRequestForm initialContents={HelpRequest} submitAction={onSubmit} buttonLabel="Update" />
          }
        </div>
      </BasicLayout>
    )
}
