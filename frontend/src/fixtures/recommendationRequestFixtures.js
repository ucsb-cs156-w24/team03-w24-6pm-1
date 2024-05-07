const recommendationRequestFixtures = {
    oneRequest: {
        "id": 1,
        "requesterEmail": "requestexample1@ucsb.edu",
        "professorEmail": "request1@ucsb.edu",
        "explanation": "Request explanation goes here",
        "dateRequested": "2022-03-08T12:00:00",
        "dateNeeded": "2023-01-05T12:00:00",
        "done": true
    },
    threeRequests: [
        {
            "id": 1,
            "requesterEmail": "requestexample1@ucsb.edu",
            "professorEmail": "request1@ucsb.edu", 
            "explanation": "Request explanation goes here",
            "dateRequested": "2022-03-08T12:00:00",
            "dateNeeded": "2023-01-05T12:00:00",
            "done": true
        },
        {
            "id": 2,
            "requesterEmail": "requestexample2@ucsb.edu",
            "professorEmail": "request2@ucsb.edu",
            "explanation": "request 2 explanation",
            "dateRequested": "2022-12-10T12:00:00",
            "dateNeeded": "2023-08-05T12:00:00",
            "done": true
        },
        {
            "id": 3,
            "requesterEmail": "requestexample3@ucsb.edu",
            "professorEmail": "request3@ucsb.edu",
            "explanation": "request 3 explanation",
            "dateRequested": "2022-01-10T12:00:00",
            "dateNeeded": "2023-08-27T12:00:00",
            "done": true
        }
    ]
};


export { recommendationRequestFixtures };
