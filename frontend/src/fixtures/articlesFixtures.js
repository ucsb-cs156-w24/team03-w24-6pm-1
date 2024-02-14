// @Id
// @GeneratedValue(strategy = GenerationType.IDENTITY)
// private long id;

// private String title;
// private String url;
// private String explanation;
// private String email;
// private LocalDateTime dateAdded;

const articlesFixtures = {
    oneArticle:
    [
      {
       "id": 1,
        "title": "LeBron James Breaks Kareem Abdul-Jabbar’s N.B.A. Scoring Record",
        "url": "https://www.nytimes.com/2023/02/07/sports/lebron-james-nba-scoring-record.html#:~:text=LOS%20ANGELES%20%E2%80%94%20One%20of%20the,of%2038%2C387%20points%20on%20Tuesday.",
        "explanation": "James, the Los Angeles Lakers star, scored the record-breaking 38,388th point that had eluded generations of superstars.",
        "email": "haroldmo@ucsb.edu",
        "dateAdded": "2022-03-11T00:00:00"
      }
    ],

    threeArticles:
    [
        {
            "id": 2,
             "title": "Apple debuts iPhone 15 and iPhone 15 Plus",
             "url": "https://www.apple.com/newsroom/2023/09/apple-debuts-iphone-15-and-iphone-15-plus/",
             "explanation": "A huge leap forward for iPhone with a gorgeous new design featuring a durable, color-infused back glass and new contoured edge; the Dynamic Island; a 48MP Main camera with 2x Telephoto; and USB‑C",
             "email": "haroldmo@ucsb.edu",
             "dateAdded": "2022-03-11T00:00:00"
        },

        {
            "id": 3,
             "title": "Apple 16-inch M3 Max MacBook Pro review: A desktop among laptops",
             "url": "https://techcrunch.com/2023/11/06/apple-macbook-pro-review-m3-max/",
             "explanation": "The laptop, which starts at $2,500 (plus some pricey add-ons), splits the difference between the Mac Studio and MacBook Air",
             "email": "haroldmo@ucsb.edu",
             "dateAdded": "2022-03-11T00:00:00"
        },

        {
            "id": 4,
             "title": "Explained: Neural networks",
             "url": "https://news.mit.edu/2017/explained-neural-networks-deep-learning-0414",
             "explanation": "Ballyhooed artificial-intelligence technique known as “deep learning” revives 70-year-old idea.",
             "email": "haroldmo@ucsb.edu",
             "dateAdded": "2022-03-11T00:00:00"
        },
        
    ]
};

export { articlesFixtures };