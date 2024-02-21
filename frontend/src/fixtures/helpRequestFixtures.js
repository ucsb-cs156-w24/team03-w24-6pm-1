const helpRequestFixtures = {
    oneHelpRequest: [{
        "id" : 1,
        "requesterEmail": "spam@gmail.com",
        "teamId": "s22-5pm-3",
        "tableOrBreakoutRoom": "4",
        "requestTime": "2022-04-20T17:35",
        "explanation": "bruh idk",
        "solved": true
    }],
    threeHelpRequests: [
        {
            "id" : 1,
            "requesterEmail": "spam@gmail.com",
            "teamId": "s22-5pm-3",
            "tableOrBreakoutRoom": "4",
            "requestTime": "2022-04-20T17:35",
            "explanation": "bruh idk",
            "solved": true
        },
        {
            "id" : 2,
            "requesterEmail": "spam2@gmail.com",
            "teamId": "s22-6pm-3",
            "tableOrBreakoutRoom": "8",
            "requestTime": "2022-07-20T17:35",
            "explanation": "late ig",
            "solved": true
        },
        {
            "id" : 3,
            "requesterEmail": "spam3@gmail.com",
            "teamId": "s23-5pm-3",
            "tableOrBreakoutRoom": "5",
            "requestTime": "2022-05-20T17:35",
            "explanation": "error",
            "solved": false
        }
    ]
};


export { helpRequestFixtures };