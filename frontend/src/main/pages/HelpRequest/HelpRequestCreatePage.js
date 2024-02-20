import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequest from "main/components/HelpRequest/HelpRequestForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestCreatePage({storybook=false}) {

  const objectToAxiosParams = (request) => ({
    url: "/api/helprequests/post",
    method: "POST",
    params: {
      requesterEmail: request.requesterEmail,
      teamId: request.teamId,
      tableOrBreakoutRoom: request.tableOrBreakoutRoom,
      requestTime: request.requestTime,
      explanation: request.explanation,
      solved: request.solved
    }
  });

  const onSuccess = (request) => {
    toast(`New Help Request Created - id: ${request.id} email: ${request.requesterEmail}`); // fixme
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/helprequests/all"] // mutation makes this key stale so that pages relying on it reload
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
        <h1>Create New Help Request</h1>
        <HelpRequest submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
