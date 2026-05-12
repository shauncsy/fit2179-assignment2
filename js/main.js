const nblTeamLocations = [
    {
        "number": 1,
        "team": "Adelaide",
        "fullTeam": "Adelaide 36ers",
        "city": "Adelaide",
        "longitude": 138.6007,
        "latitude": -34.9285
    },
    {
        "number": 2,
        "team": "Brisbane",
        "fullTeam": "Brisbane Bullets",
        "city": "Brisbane",
        "longitude": 153.0251,
        "latitude": -27.4698
    },
    {
        "number": 3,
        "team": "Cairns",
        "fullTeam": "Cairns Taipans",
        "city": "Cairns",
        "longitude": 145.7781,
        "latitude": -16.9186
    },
    {
        "number": 4,
        "team": "Illawarra",
        "fullTeam": "Illawarra Hawks",
        "city": "Wollongong",
        "longitude": 150.8931,
        "latitude": -34.4278
    },
    {
        "number": 5,
        "team": "Melbourne",
        "fullTeam": "Melbourne United",
        "city": "Melbourne",
        "longitude": 144.9631,
        "latitude": -37.8136
    },
    {
        "number": 6,
        "team": "New Zealand",
        "fullTeam": "New Zealand Breakers",
        "city": "Auckland",
        "longitude": 174.7633,
        "latitude": -36.8485
    },
    {
        "number": 7,
        "team": "Perth",
        "fullTeam": "Perth Wildcats",
        "city": "Perth",
        "longitude": 115.8605,
        "latitude": -31.9505
    },
    {
        "number": 8,
        "team": "South East Melbourne",
        "fullTeam": "South East Melbourne Phoenix",
        "city": "South East Melbourne",
        "longitude": 145.2,
        "latitude": -37.95
    },
    {
        "number": 9,
        "team": "Sydney",
        "fullTeam": "Sydney Kings",
        "city": "Sydney",
        "longitude": 151.2093,
        "latitude": -33.8688
    },
    {
        "number": 10,
        "team": "Tasmania",
        "fullTeam": "Tasmania JackJumpers",
        "city": "Hobart",
        "longitude": 147.3272,
        "latitude": -42.8821
    }
];

const nblTeamData = {
    "url": "data/nbl-team-stats.csv",
    "format": {
        "type": "csv"
    }
};

let currentNblScale = 620;
const originalNblScale = 620;

function createNblTransforms() {
    return [
        {
            "lookup": "Team",
            "from": {
                "data": {
                    "values": nblTeamLocations
                },
                "key": "team",
                "fields": [
                    "number",
                    "fullTeam",
                    "city",
                    "longitude",
                    "latitude"
                ]
            }
        },
        {
            "calculate": "toNumber(datum.WinPercentage)",
            "as": "WinPercentNum"
        },
        {
            "calculate": "toNumber(datum.Percentage)",
            "as": "PointPercentageNum"
        },
        {
            "calculate": "toNumber(datum.Score)",
            "as": "ScoreNum"
        },
        {
            "calculate": "toNumber(datum.Score_Against)",
            "as": "ScoreAgainstNum"
        },
        {
            "calculate": "datum.ScoreNum - datum.ScoreAgainstNum",
            "as": "ScoreDifference"
        },
        {
            "calculate": "datum.Wins + '-' + datum.Losses",
            "as": "Record"
        },
        {
            "window": [
                {
                    "op": "row_number",
                    "as": "rank"
                }
            ],
            "sort": [
                {
                    "field": "WinPercentNum",
                    "order": "descending"
                },
                {
                    "field": "PointPercentageNum",
                    "order": "descending"
                }
            ]
        },
        {
            "filter": "datum.longitude != null && datum.latitude != null"
        }
    ];
}

function createNblMapSpec(scaleValue) {
    return {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": 900,
        "height": 580,
        "title": "NBL Team Locations and Performance",

        "projection": {
            "type": "mercator",
            "center": [138, -30],
            "scale": scaleValue
        },

        "layer": [
            {
                "data": {
                    "url": "https://vega.github.io/vega-datasets/data/world-110m.json",
                    "format": {
                        "type": "topojson",
                        "feature": "countries"
                    }
                },
                "transform": [
                    {
                        "filter": "datum.id == 36 || datum.id == 554"
                    }
                ],
                "mark": {
                    "type": "geoshape",
                    "fill": "#e5e7eb",
                    "stroke": "#9ca3af",
                    "strokeWidth": 1
                }
            },
            {
                "data": nblTeamData,
                "transform": createNblTransforms(),
                "mark": {
                    "type": "circle",
                    "size": 520,
                    "stroke": "white",
                    "strokeWidth": 2,
                    "opacity": 0.9
                },
                "encoding": {
                    "longitude": {
                        "field": "longitude",
                        "type": "quantitative"
                    },
                    "latitude": {
                        "field": "latitude",
                        "type": "quantitative"
                    },
                    "color": {
                        "field": "WinPercentNum",
                        "type": "quantitative",
                        "title": "Win %",
                        "scale": {
                            "scheme": "yellowgreenblue"
                        }
                    },
                    "tooltip": [
                        {
                            "field": "rank",
                            "type": "ordinal",
                            "title": "Rank"
                        },
                        {
                            "field": "fullTeam",
                            "type": "nominal",
                            "title": "Team"
                        },
                        {
                            "field": "city",
                            "type": "nominal",
                            "title": "City"
                        },
                        {
                            "field": "Record",
                            "type": "nominal",
                            "title": "Record"
                        },
                        {
                            "field": "Matches",
                            "type": "quantitative",
                            "title": "Matches"
                        },
                        {
                            "field": "Wins",
                            "type": "quantitative",
                            "title": "Wins"
                        },
                        {
                            "field": "Losses",
                            "type": "quantitative",
                            "title": "Losses"
                        },
                        {
                            "field": "WinPercentNum",
                            "type": "quantitative",
                            "title": "Win %",
                            "format": ".1f"
                        },
                        {
                            "field": "PointPercentageNum",
                            "type": "quantitative",
                            "title": "Point %",
                            "format": ".1f"
                        },
                        {
                            "field": "ScoreNum",
                            "type": "quantitative",
                            "title": "Average Score",
                            "format": ".1f"
                        },
                        {
                            "field": "ScoreAgainstNum",
                            "type": "quantitative",
                            "title": "Average Score Against",
                            "format": ".1f"
                        },
                        {
                            "field": "ScoreDifference",
                            "type": "quantitative",
                            "title": "Score Difference",
                            "format": ".1f"
                        },
                        {
                            "field": "FieldGoalPercentage",
                            "type": "quantitative",
                            "title": "FG %",
                            "format": ".1f"
                        },
                        {
                            "field": "ThreePointPercentage",
                            "type": "quantitative",
                            "title": "3PT %",
                            "format": ".1f"
                        },
                        {
                            "field": "TotalRebounds",
                            "type": "quantitative",
                            "title": "Rebounds",
                            "format": ".1f"
                        },
                        {
                            "field": "Assists",
                            "type": "quantitative",
                            "title": "Assists",
                            "format": ".1f"
                        },
                        {
                            "field": "Turnovers",
                            "type": "quantitative",
                            "title": "Turnovers",
                            "format": ".1f"
                        }
                    ]
                }
            },
            {
                "data": nblTeamData,
                "transform": createNblTransforms(),
                "mark": {
                    "type": "text",
                    "color": "white",
                    "fontSize": 13,
                    "fontWeight": "bold",
                    "stroke": "black",
                    "strokeWidth": 0.5
                },
                "encoding": {
                    "longitude": {
                        "field": "longitude",
                        "type": "quantitative"
                    },
                    "latitude": {
                        "field": "latitude",
                        "type": "quantitative"
                    },
                    "text": {
                        "field": "rank",
                        "type": "ordinal"
                    }
                }
            }
        ]
    };
}

function drawNblMap() {
    const nblMapSpec = createNblMapSpec(currentNblScale);

    vegaEmbed("#nbl_map", nblMapSpec, {
        "actions": false
    });
}

document.getElementById("zoom_in").addEventListener("click", function () {
    currentNblScale = currentNblScale + 100;
    drawNblMap();
});

document.getElementById("zoom_out").addEventListener("click", function () {
    currentNblScale = currentNblScale - 100;

    if (currentNblScale < 300) {
        currentNblScale = 300;
    }

    drawNblMap();
});

document.getElementById("zoom_reset").addEventListener("click", function () {
    currentNblScale = originalNblScale;
    drawNblMap();
});

drawNblMap();