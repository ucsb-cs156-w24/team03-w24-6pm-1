
import { useBackend } from 'main/utils/useBackend';

import MenuItemReviewTable from 'main/components/MenuItemReview/MenuItemReviewTable';
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { hasRole, useCurrentUser } from 'main/utils/currentUser';
import { Button } from 'react-bootstrap';

export default function MenuItemReviewIndexPage() {

    const currentUser = useCurrentUser();

  
    const { data: reviews, error: _error, status: _status } =
        useBackend(
          
            ["/api/menuitemreview/all"],
            { method: "GET", url: "/api/menuitemreview/all" },
            // Stryker disable next-line everything
            []
        );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/menuitemreview/create"
                    style={{ float: "right" }}
                >
                    Create Review
                </Button>
            )
        } 
    }


    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h1>Reviews</h1>
                <MenuItemReviewTable reviews={reviews} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}
