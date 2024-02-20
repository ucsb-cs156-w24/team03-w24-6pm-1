import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestTable from 'main/components/HelpRequest/HelpRequestTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser , hasRole} from 'main/utils/currentUser';

export default function HelpRequestIndexPage() {



  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
        return (
            <Button
                variant="primary"
                href="/helprequests/create"
                style={{ float: "right" }}
            >
                Create Help Request 
            </Button>
        )
    } 
  }
  
  const { data: requests, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/helprequests/all"],
      { method: "GET", url: "/api/helprequests/all" },
      []
    );
  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>HelpRequest</h1>
        <HelpRequestTable requests={requests} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}
