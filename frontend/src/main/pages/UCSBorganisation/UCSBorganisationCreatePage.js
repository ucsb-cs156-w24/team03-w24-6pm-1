import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBorganisationForm from "main/components/UCSBorganisation/UCSBorganisationForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBorganisationCreatePage({storybook=false}) {

  const objectToAxiosParams = (UCSBorganisation) => ({
    url: "/api/UCSBOrganization/post",
    method: "POST",
    params: {
     orgCode: UCSBorganisation.orgCode,
     orgTranslationShort: UCSBorganisation.orgTranslationShort,
     orgTranslation: UCSBorganisation.orgTranslation,
     inactive: UCSBorganisation.inactive
    }
  });

  const onSuccess = (UCSBorganisation) => {
    toast(`New UCSBorganisation Created - orgCode: ${UCSBorganisation.orgCode} orgTranslationShort: ${UCSBorganisation.orgTranslationShort} orgTranslation:  ${UCSBorganisation.orgTranslation} inactive: ${UCSBorganisation.inactive}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/UCSBOrganization/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/UCSBOrganization" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSBorganisation</h1>
        <UCSBorganisationForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
