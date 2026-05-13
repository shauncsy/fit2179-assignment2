
// Idiom1: NBL Team Locations Map
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




// Idiom2: NBL Offensive and Defensive Performance Map
let currentPerformanceView = "offense";

function createPerformanceMapSpec(viewType) {
    let mapTitle = "";
    let colorField = "";
    let colorTitle = "";
    let sizeField = "";
    let sizeTitle = "";
    let colorScheme = "";
    let reverseScale = false;

    if (viewType === "offense") {
        mapTitle = "NBL Offensive Performance Map";
        colorField = "ScoreNum";
        colorTitle = "Average Score";
        sizeField = "FieldGoalPercentage";
        sizeTitle = "FG %";
        colorScheme = "oranges";
        reverseScale = false;
    } else if (viewType === "defense") {
        mapTitle = "NBL Defensive Performance Map";
        colorField = "ScoreAgainstNum";
        colorTitle = "Average Score Against";
        sizeField = "TotalRebounds";
        sizeTitle = "Total Rebounds";
        colorScheme = "redyellowgreen";
        reverseScale = true;
    } else {
        mapTitle = "NBL Net Score Difference Map";
        colorField = "ScoreDifference";
        colorTitle = "Score Difference";
        sizeField = "WinPercentNum";
        sizeTitle = "Win %";
        colorScheme = "redblue";
        reverseScale = false;
    }

    return {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": 900,
        "height": 580,
        "title": mapTitle,

        "projection": {
            "type": "mercator",
            "center": [138, -30],
            "scale": 620
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
                        "field": colorField,
                        "type": "quantitative",
                        "title": colorTitle,
                        "scale": {
                            "scheme": colorScheme,
                            "reverse": reverseScale
                        }
                    },
                    "size": {
                        "field": sizeField,
                        "type": "quantitative",
                        "title": sizeTitle,
                        "scale": {
                            "range": [200, 850]
                        }
                    },
                    "tooltip": [
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
                            "field": "rank",
                            "type": "ordinal",
                            "title": "Rank"
                        },
                        {
                            "field": "Record",
                            "type": "nominal",
                            "title": "Record"
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
            }
        ]
    };
}

function drawPerformanceMap() {
    const performanceMapSpec = createPerformanceMapSpec(currentPerformanceView);

    vegaEmbed("#nbl_performance_map", performanceMapSpec, {
        "actions": false
    });
}

document.getElementById("show_offense").addEventListener("click", function () {
    currentPerformanceView = "offense";
    drawPerformanceMap();
});

document.getElementById("show_defense").addEventListener("click", function () {
    currentPerformanceView = "defense";
    drawPerformanceMap();
});

document.getElementById("show_net").addEventListener("click", function () {
    currentPerformanceView = "net";
    drawPerformanceMap();
});

drawPerformanceMap();


// Idiom3: NBL Team Metric Ranking Bar Chart
function createNblTeamAnalysisTransforms() {
    return createNblTransforms().concat([
        {
            "calculate": "toNumber(datum.FieldGoalPercentage)",
            "as": "FieldGoalPctNum"
        },
        {
            "calculate": "toNumber(datum.ThreePointPercentage)",
            "as": "ThreePointPctNum"
        },
        {
            "calculate": "toNumber(datum.TotalRebounds)",
            "as": "TotalReboundsNum"
        },
        {
            "calculate": "toNumber(datum.Assists)",
            "as": "AssistsNum"
        },
        {
            "calculate": "toNumber(datum.Turnovers)",
            "as": "TurnoversNum"
        }
    ]);
}

const metricInfo = {
    "WinPercentNum": {
        "title": "Win Percentage",
        "format": ".1f",
        "sortOrder": "descending"
    },
    "ScoreNum": {
        "title": "Average Score",
        "format": ".1f",
        "sortOrder": "descending"
    },
    "ScoreAgainstNum": {
        "title": "Average Score Against",
        "format": ".1f",
        "sortOrder": "ascending"
    },
    "FieldGoalPctNum": {
        "title": "Field Goal Percentage",
        "format": ".1f",
        "sortOrder": "descending"
    },
    "ThreePointPctNum": {
        "title": "Three Point Percentage",
        "format": ".1f",
        "sortOrder": "descending"
    },
    "TotalReboundsNum": {
        "title": "Total Rebounds",
        "format": ".1f",
        "sortOrder": "descending"
    },
    "AssistsNum": {
        "title": "Assists",
        "format": ".1f",
        "sortOrder": "descending"
    },
    "TurnoversNum": {
        "title": "Turnovers",
        "format": ".1f",
        "sortOrder": "ascending"
    }
};

function createMetricBarSpec(metricField) {
    const selectedMetric = metricInfo[metricField];

    return {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": 850,
        "height": 420,
        "title": "NBL Team Ranking by " + selectedMetric.title,

        "data": nblTeamData,

        "transform": createNblTeamAnalysisTransforms(),

        "mark": {
            "type": "bar",
            "cornerRadiusEnd": 4
        },

        "encoding": {
            "y": {
                "field": "fullTeam",
                "type": "nominal",
                "title": "Team",
                "sort": {
                    "field": metricField,
                    "order": selectedMetric.sortOrder
                }
            },
            "x": {
                "field": metricField,
                "type": "quantitative",
                "title": selectedMetric.title
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
                    "field": "fullTeam",
                    "type": "nominal",
                    "title": "Team"
                },
                {
                    "field": "rank",
                    "type": "ordinal",
                    "title": "Overall Rank"
                },
                {
                    "field": "Record",
                    "type": "nominal",
                    "title": "Record"
                },
                {
                    "field": metricField,
                    "type": "quantitative",
                    "title": selectedMetric.title,
                    "format": selectedMetric.format
                },
                {
                    "field": "WinPercentNum",
                    "type": "quantitative",
                    "title": "Win %",
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
                    "field": "FieldGoalPctNum",
                    "type": "quantitative",
                    "title": "FG %",
                    "format": ".1f"
                },
                {
                    "field": "ThreePointPctNum",
                    "type": "quantitative",
                    "title": "3PT %",
                    "format": ".1f"
                }
            ]
        }
    };
}

function drawMetricBar() {
    const selectedMetric = document.getElementById("team_metric_select").value;
    const metricBarSpec = createMetricBarSpec(selectedMetric);

    vegaEmbed("#nbl_metric_bar", metricBarSpec, {
        "actions": false
    });
}

document.getElementById("team_metric_select").addEventListener("change", function () {
    drawMetricBar();
});

drawMetricBar();

// Idiom4: NBL Offensive vs Defensive Efficiency Scatter Plot
const nblEfficiencyScatterSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": 850,
    "height": 500,
    "title": "NBL Offensive vs Defensive Efficiency",

    "layer": [
        {
            "data": nblTeamData,
            "transform": createNblTeamAnalysisTransforms(),
            "mark": {
                "type": "circle",
                "opacity": 0.85,
                "stroke": "white",
                "strokeWidth": 2
            },
            "encoding": {
                "x": {
                    "field": "ScoreNum",
                    "type": "quantitative",
                    "title": "Average Score",
                    "scale": {
                        "zero": false
                    }
                },
                "y": {
                    "field": "ScoreAgainstNum",
                    "type": "quantitative",
                    "title": "Average Score Against",
                    "scale": {
                        "zero": false
                    }
                },
                "size": {
                    "field": "TotalReboundsNum",
                    "type": "quantitative",
                    "title": "Total Rebounds",
                    "scale": {
                        "range": [150, 900]
                    }
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
                        "field": "fullTeam",
                        "type": "nominal",
                        "title": "Team"
                    },
                    {
                        "field": "rank",
                        "type": "ordinal",
                        "title": "Overall Rank"
                    },
                    {
                        "field": "Record",
                        "type": "nominal",
                        "title": "Record"
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
                        "field": "WinPercentNum",
                        "type": "quantitative",
                        "title": "Win %",
                        "format": ".1f"
                    },
                    {
                        "field": "TotalReboundsNum",
                        "type": "quantitative",
                        "title": "Total Rebounds",
                        "format": ".1f"
                    },
                    {
                        "field": "AssistsNum",
                        "type": "quantitative",
                        "title": "Assists",
                        "format": ".1f"
                    },
                    {
                        "field": "TurnoversNum",
                        "type": "quantitative",
                        "title": "Turnovers",
                        "format": ".1f"
                    }
                ]
            }
        },
        {
            "data": nblTeamData,
            "transform": createNblTeamAnalysisTransforms(),
            "mark": {
                "type": "text",
                "align": "left",
                "baseline": "middle",
                "dx": 8,
                "fontSize": 11
            },
            "encoding": {
                "x": {
                    "field": "ScoreNum",
                    "type": "quantitative"
                },
                "y": {
                    "field": "ScoreAgainstNum",
                    "type": "quantitative"
                },
                "text": {
                    "field": "Team",
                    "type": "nominal"
                }
            }
        }
    ]
};

vegaEmbed("#nbl_efficiency_scatter", nblEfficiencyScatterSpec, {
    "actions": false
});

// Idiom5: NBL Team Performance Profile Heatmap
const nblProfileHeatmapSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": 850,
    "height": 390,
    "title": "NBL Team Performance Profile Heatmap",

    "data": nblTeamData,

    "transform": createNblTeamAnalysisTransforms().concat([
        {
            "fold": [
                "WinPercentNum",
                "ScoreNum",
                "ScoreAgainstNum",
                "FieldGoalPctNum",
                "ThreePointPctNum",
                "TotalReboundsNum",
                "AssistsNum",
                "TurnoversNum"
            ],
            "as": ["MetricField", "RawValue"]
        },
        {
            "calculate": "datum.MetricField == 'WinPercentNum' ? 'Win %' : datum.MetricField == 'ScoreNum' ? 'Score' : datum.MetricField == 'ScoreAgainstNum' ? 'Score Against' : datum.MetricField == 'FieldGoalPctNum' ? 'FG %' : datum.MetricField == 'ThreePointPctNum' ? '3PT %' : datum.MetricField == 'TotalReboundsNum' ? 'Rebounds' : datum.MetricField == 'AssistsNum' ? 'Assists' : 'Turnovers'",
            "as": "Metric"
        },
        {
            "joinaggregate": [
                {
                    "op": "min",
                    "field": "RawValue",
                    "as": "MetricMin"
                },
                {
                    "op": "max",
                    "field": "RawValue",
                    "as": "MetricMax"
                }
            ],
            "groupby": ["MetricField"]
        },
        {
            "calculate": "datum.MetricMax == datum.MetricMin ? 0.5 : (datum.RawValue - datum.MetricMin) / (datum.MetricMax - datum.MetricMin)",
            "as": "NormalisedValue"
        },
        {
            "calculate": "datum.MetricField == 'ScoreAgainstNum' || datum.MetricField == 'TurnoversNum' ? 1 - datum.NormalisedValue : datum.NormalisedValue",
            "as": "PerformanceScore"
        },
        {
            "calculate": "datum.PerformanceScore * 100",
            "as": "PerformanceScorePct"
        }
    ]),

    "mark": {
        "type": "rect",
        "stroke": "white",
        "strokeWidth": 1
    },

    "encoding": {
        "x": {
            "field": "Metric",
            "type": "nominal",
            "title": "Performance Metric",
            "sort": [
                "Win %",
                "Score",
                "Score Against",
                "FG %",
                "3PT %",
                "Rebounds",
                "Assists",
                "Turnovers"
            ]
        },
        "y": {
            "field": "fullTeam",
            "type": "nominal",
            "title": "Team",
            "sort": {
                "op": "min",
                "field": "rank",
                "order": "ascending"
            }
        },
        "color": {
            "field": "PerformanceScorePct",
            "type": "quantitative",
            "title": "Relative Strength",
            "scale": {
                "scheme": "yellowgreenblue",
                "domain": [0, 100]
            }
        },
        "tooltip": [
            {
                "field": "fullTeam",
                "type": "nominal",
                "title": "Team"
            },
            {
                "field": "rank",
                "type": "ordinal",
                "title": "Overall Rank"
            },
            {
                "field": "Metric",
                "type": "nominal",
                "title": "Metric"
            },
            {
                "field": "RawValue",
                "type": "quantitative",
                "title": "Original Value",
                "format": ".1f"
            },
            {
                "field": "PerformanceScorePct",
                "type": "quantitative",
                "title": "Relative Strength",
                "format": ".1f"
            }
        ]
    }
};

vegaEmbed("#nbl_profile_heatmap", nblProfileHeatmapSpec, {
    "actions": false
});






// Idiom7: NBL Player Scoring Style Analysis
const nblPlayerData = {
    "url": "data/nbl-player-stats.csv",
    "format": {
        "type": "csv"
    }
};

function createNblPlayerTransforms() {
    return [
        {
            "calculate": "toNumber(datum.Matches)",
            "as": "MatchesNum"
        },
        {
            "calculate": "toNumber(datum.Minutes_A)",
            "as": "MinutesNum"
        },
        {
            "calculate": "toNumber(datum.Points_A)",
            "as": "PointsNum"
        },
        {
            "calculate": "toNumber(datum.Assists_A)",
            "as": "AssistsNum"
        },
        {
            "calculate": "toNumber(datum.TotalRebounds_A)",
            "as": "ReboundsNum"
        },
        {
            "calculate": "toNumber(datum.ThreePointersAttempted_A)",
            "as": "ThreePointAttemptsNum"
        },
        {
            "calculate": "toNumber(datum.FreeThrowsAttempted_A)",
            "as": "FreeThrowAttemptsNum"
        },
        {
            "calculate": "toNumber(datum.EffectiveFieldGoalPercentage)",
            "as": "EffectiveFieldGoalPctNum"
        },
        {
            "calculate": "toNumber(datum.PPP)",
            "as": "PPPNum"
        },
        {
            "calculate": "toNumber(datum.PIE)",
            "as": "PIENum"
        },
        {
            "calculate": "toNumber(datum.FIC)",
            "as": "FICNum"
        },
        {
            "calculate": "toNumber(datum.PlusMinusPoints_A)",
            "as": "PlusMinusNum"
        },
        {
            "filter": "datum.MatchesNum >= 10 && datum.MinutesNum >= 10"
        }
    ];
}

const nblPlayerScoringStyleSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": 850,
    "height": 500,
    "title": "NBL Player Scoring Style Analysis",

    "data": nblPlayerData,

    "transform": createNblPlayerTransforms(),

    "mark": {
        "type": "circle",
        "opacity": 0.75,
        "stroke": "white",
        "strokeWidth": 1.5
    },

    "encoding": {
        "x": {
            "field": "ThreePointAttemptsNum",
            "type": "quantitative",
            "title": "Three-Point Attempts Per Game",
            "scale": {
                "zero": false
            }
        },
        "y": {
            "field": "FreeThrowAttemptsNum",
            "type": "quantitative",
            "title": "Free Throw Attempts Per Game",
            "scale": {
                "zero": false
            }
        },
        "size": {
            "field": "PointsNum",
            "type": "quantitative",
            "title": "Points Per Game",
            "scale": {
                "range": [40, 800]
            }
        },
        "color": {
            "field": "EffectiveFieldGoalPctNum",
            "type": "quantitative",
            "title": "eFG %",
            "scale": {
                "scheme": "yellowgreenblue"
            }
        },
        "tooltip": [
            {
                "field": "Player",
                "type": "nominal",
                "title": "Player"
            },
            {
                "field": "Team",
                "type": "nominal",
                "title": "Team"
            },
            {
                "field": "MatchesNum",
                "type": "quantitative",
                "title": "Matches"
            },
            {
                "field": "MinutesNum",
                "type": "quantitative",
                "title": "Minutes",
                "format": ".1f"
            },
            {
                "field": "PointsNum",
                "type": "quantitative",
                "title": "Points",
                "format": ".1f"
            },
            {
                "field": "ThreePointAttemptsNum",
                "type": "quantitative",
                "title": "3PA",
                "format": ".1f"
            },
            {
                "field": "FreeThrowAttemptsNum",
                "type": "quantitative",
                "title": "FTA",
                "format": ".1f"
            },
            {
                "field": "EffectiveFieldGoalPctNum",
                "type": "quantitative",
                "title": "eFG %",
                "format": ".1f"
            },
            {
                "field": "AssistsNum",
                "type": "quantitative",
                "title": "Assists",
                "format": ".1f"
            },
            {
                "field": "ReboundsNum",
                "type": "quantitative",
                "title": "Rebounds",
                "format": ".1f"
            }
        ]
    }
};

vegaEmbed("#nbl_player_scoring_style", nblPlayerScoringStyleSpec, {
    "actions": false
});


// Idiom8:  NBL Player Advanced Efficiency Analysis
const nblPlayerAdvancedEfficiencySpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": 850,
    "height": 500,
    "title": "NBL Player Advanced Efficiency Analysis",

    "data": nblPlayerData,

    "transform": createNblPlayerTransforms().concat([
        {
            "filter": "isValid(datum.PPPNum) && isValid(datum.PIENum) && isValid(datum.FICNum) && isValid(datum.EffectiveFieldGoalPctNum)"
        }
    ]),

    "mark": {
        "type": "circle",
        "opacity": 0.75,
        "stroke": "white",
        "strokeWidth": 1.5
    },

    "encoding": {
        "x": {
            "field": "PPPNum",
            "type": "quantitative",
            "title": "PPP",
            "scale": {
                "zero": false
            }
        },
        "y": {
            "field": "PIENum",
            "type": "quantitative",
            "title": "PIE",
            "scale": {
                "zero": false
            }
        },
        "size": {
            "field": "FICNum",
            "type": "quantitative",
            "title": "FIC",
            "scale": {
                "range": [40, 900]
            }
        },
        "color": {
            "field": "EffectiveFieldGoalPctNum",
            "type": "quantitative",
            "title": "eFG %",
            "scale": {
                "scheme": "yellowgreenblue"
            }
        },
        "tooltip": [
            {
                "field": "Player",
                "type": "nominal",
                "title": "Player"
            },
            {
                "field": "Team",
                "type": "nominal",
                "title": "Team"
            },
            {
                "field": "MatchesNum",
                "type": "quantitative",
                "title": "Matches"
            },
            {
                "field": "MinutesNum",
                "type": "quantitative",
                "title": "Minutes Per Game",
                "format": ".1f"
            },
            {
                "field": "PointsNum",
                "type": "quantitative",
                "title": "Points Per Game",
                "format": ".1f"
            },
            {
                "field": "AssistsNum",
                "type": "quantitative",
                "title": "Assists Per Game",
                "format": ".1f"
            },
            {
                "field": "ReboundsNum",
                "type": "quantitative",
                "title": "Rebounds Per Game",
                "format": ".1f"
            },
            {
                "field": "PPPNum",
                "type": "quantitative",
                "title": "PPP",
                "format": ".2f"
            },
            {
                "field": "PIENum",
                "type": "quantitative",
                "title": "PIE",
                "format": ".1f"
            },
            {
                "field": "FICNum",
                "type": "quantitative",
                "title": "FIC",
                "format": ".1f"
            },
            {
                "field": "EffectiveFieldGoalPctNum",
                "type": "quantitative",
                "title": "eFG %",
                "format": ".1f"
            }
        ]
    }
};

vegaEmbed("#nbl_player_advanced_efficiency", nblPlayerAdvancedEfficiencySpec, {
    "actions": false
});

// Idiom6: NBL Top Player Ranking Bar Chart
const playerMetricInfo = {
    "PointsNum": {
        "title": "Points Per Game",
        "format": ".1f"
    },
    "AssistsNum": {
        "title": "Assists Per Game",
        "format": ".1f"
    },
    "ReboundsNum": {
        "title": "Rebounds Per Game",
        "format": ".1f"
    },
    "PPPNum": {
        "title": "PPP",
        "format": ".2f"
    },
    "PIENum": {
        "title": "PIE",
        "format": ".1f"
    },
    "FICNum": {
        "title": "FIC",
        "format": ".1f"
    },
    "EffectiveFieldGoalPctNum": {
        "title": "Effective Field Goal %",
        "format": ".1f"
    }
};

function createNblPlayerTopRankingSpec(metricField) {
    const selectedMetric = playerMetricInfo[metricField];

    return {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "width": 850,
        "height": 500,
        "title": "Top 15 NBL Players by " + selectedMetric.title,

        "data": nblPlayerData,

        "transform": createNblPlayerTransforms().concat([
            {
                "filter": "isValid(datum." + metricField + ")"
            },
            {
                "calculate": "datum.Player + ' (' + datum.Team + ')'",
                "as": "PlayerLabel"
            },
            {
                "window": [
                    {
                        "op": "row_number",
                        "as": "PlayerRank"
                    }
                ],
                "sort": [
                    {
                        "field": metricField,
                        "order": "descending"
                    }
                ]
            },
            {
                "filter": "datum.PlayerRank <= 15"
            }
        ]),

        "mark": {
            "type": "bar",
            "cornerRadiusEnd": 4
        },

        "encoding": {
            "y": {
                "field": "PlayerLabel",
                "type": "nominal",
                "title": "Player",
                "sort": {
                    "field": "PlayerRank",
                    "order": "ascending"
                }
            },
            "x": {
                "field": metricField,
                "type": "quantitative",
                "title": selectedMetric.title
            },
            "color": {
                "field": "Team",
                "type": "nominal",
                "title": "Team"
            },
            "tooltip": [
                {
                    "field": "PlayerRank",
                    "type": "ordinal",
                    "title": "Rank"
                },
                {
                    "field": "Player",
                    "type": "nominal",
                    "title": "Player"
                },
                {
                    "field": "Team",
                    "type": "nominal",
                    "title": "Team"
                },
                {
                    "field": "MatchesNum",
                    "type": "quantitative",
                    "title": "Matches"
                },
                {
                    "field": "MinutesNum",
                    "type": "quantitative",
                    "title": "Minutes Per Game",
                    "format": ".1f"
                },
                {
                    "field": metricField,
                    "type": "quantitative",
                    "title": selectedMetric.title,
                    "format": selectedMetric.format
                },
                {
                    "field": "PointsNum",
                    "type": "quantitative",
                    "title": "Points",
                    "format": ".1f"
                },
                {
                    "field": "AssistsNum",
                    "type": "quantitative",
                    "title": "Assists",
                    "format": ".1f"
                },
                {
                    "field": "ReboundsNum",
                    "type": "quantitative",
                    "title": "Rebounds",
                    "format": ".1f"
                },
                {
                    "field": "PPPNum",
                    "type": "quantitative",
                    "title": "PPP",
                    "format": ".2f"
                },
                {
                    "field": "PIENum",
                    "type": "quantitative",
                    "title": "PIE",
                    "format": ".1f"
                },
                {
                    "field": "FICNum",
                    "type": "quantitative",
                    "title": "FIC",
                    "format": ".1f"
                },
                {
                    "field": "EffectiveFieldGoalPctNum",
                    "type": "quantitative",
                    "title": "eFG %",
                    "format": ".1f"
                }
            ]
        }
    };
}

function drawNblPlayerTopRanking() {
    const selectedMetric = document.getElementById("player_metric_select").value;
    const playerRankingSpec = createNblPlayerTopRankingSpec(selectedMetric);

    vegaEmbed("#nbl_player_top_ranking", playerRankingSpec, {
        "actions": false
    });
}

document.getElementById("player_metric_select").addEventListener("change", function () {
    drawNblPlayerTopRanking();
});

drawNblPlayerTopRanking();


// Idiom9: 
const nbaPerGameComparisonData = {
    "url": "data/nba-player-stats-per-game.csv",
    "format": {
        "type": "csv"
    }
};

const nbaTotalComparisonData = {
    "url": "data/nba-player-stats-total.csv",
    "format": {
        "type": "csv"
    }
};

function createNblComparisonPlayerTransforms() {
    return [
        {
            "calculate": "'NBL'",
            "as": "League"
        },
        {
            "calculate": "toNumber(datum.Matches)",
            "as": "GamesNum"
        },
        {
            "calculate": "toNumber(datum.Minutes_A)",
            "as": "MinutesNum"
        },
        {
            "calculate": "toNumber(datum.Points_A)",
            "as": "PointsNum"
        },
        {
            "calculate": "toNumber(datum.ThreePointersAttempted_A)",
            "as": "ThreePointAttemptsNum"
        },
        {
            "calculate": "toNumber(datum.FreeThrowsAttempted_A)",
            "as": "FreeThrowAttemptsNum"
        },
        {
            "calculate": "toNumber(datum.EffectiveFieldGoalPercentage)",
            "as": "EffectiveFieldGoalPctNum"
        },
        {
            "filter": "datum.GamesNum >= 10 && datum.MinutesNum >= 10"
        },
        {
            "filter": "isValid(datum.PointsNum) && isValid(datum.ThreePointAttemptsNum) && isValid(datum.FreeThrowAttemptsNum) && isValid(datum.EffectiveFieldGoalPctNum)"
        }
    ];
}

function createNbaComparisonPlayerTransforms() {
    return [
        {
            "calculate": "'NBA'",
            "as": "League"
        },
        {
            "calculate": "toNumber(datum.G)",
            "as": "GamesNum"
        },
        {
            "calculate": "toNumber(datum.MP)",
            "as": "MinutesNum"
        },
        {
            "calculate": "toNumber(datum.PTS)",
            "as": "PointsNum"
        },
        {
            "calculate": "toNumber(datum['3PA'])",
            "as": "ThreePointAttemptsNum"
        },
        {
            "calculate": "toNumber(datum.FTA)",
            "as": "FreeThrowAttemptsNum"
        },
        {
            "calculate": "toNumber(datum['eFG%']) * 100",
            "as": "EffectiveFieldGoalPctNum"
        },
        {
            "filter": "datum.Team != '2TM' && datum.Team != '3TM' && datum.Team != '4TM'"
        },
        {
            "filter": "datum.GamesNum >= 20 && datum.MinutesNum >= 10"
        },
        {
            "filter": "isValid(datum.PointsNum) && isValid(datum.ThreePointAttemptsNum) && isValid(datum.FreeThrowAttemptsNum) && isValid(datum.EffectiveFieldGoalPctNum)"
        }
    ];
}

const leagueTeamScoringSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": 850,
    "height": 430,
    "title": "NBL vs NBA Team Scoring Level",

    "layer": [
        {
            "data": nblTeamData,
            "transform": [
                {
                    "calculate": "'NBL'",
                    "as": "League"
                },
                {
                    "calculate": "datum.Team",
                    "as": "TeamName"
                },
                {
                    "calculate": "toNumber(datum.Score)",
                    "as": "TeamScoring"
                },
                {
                    "calculate": "toNumber(datum.WinPercentage)",
                    "as": "WinPercentNum"
                }
            ],
            "mark": {
                "type": "circle",
                "size": 170,
                "opacity": 0.85,
                "stroke": "white",
                "strokeWidth": 1
            },
            "encoding": {
                "x": {
                    "field": "League",
                    "type": "nominal",
                    "title": "League"
                },
                "y": {
                    "field": "TeamScoring",
                    "type": "quantitative",
                    "title": "Team Points Per Game"
                },
                "color": {
                    "field": "League",
                    "type": "nominal",
                    "title": "League"
                },
                "tooltip": [
                    {
                        "field": "League",
                        "type": "nominal",
                        "title": "League"
                    },
                    {
                        "field": "TeamName",
                        "type": "nominal",
                        "title": "Team"
                    },
                    {
                        "field": "TeamScoring",
                        "type": "quantitative",
                        "title": "Points Per Game",
                        "format": ".1f"
                    },
                    {
                        "field": "WinPercentNum",
                        "type": "quantitative",
                        "title": "Win %",
                        "format": ".1f"
                    }
                ]
            }
        },
        {
            "data": nbaTotalComparisonData,
            "transform": [
                {
                    "calculate": "toNumber(datum.PTS)",
                    "as": "PlayerTotalPoints"
                },
                {
                    "filter": "datum.Team != '2TM' && datum.Team != '3TM' && datum.Team != '4TM'"
                },
                {
                    "aggregate": [
                        {
                            "op": "sum",
                            "field": "PlayerTotalPoints",
                            "as": "TeamTotalPoints"
                        }
                    ],
                    "groupby": ["Team"]
                },
                {
                    "calculate": "'NBA'",
                    "as": "League"
                },
                {
                    "calculate": "datum.Team",
                    "as": "TeamName"
                },
                {
                    "calculate": "datum.TeamTotalPoints / 82",
                    "as": "TeamScoring"
                }
            ],
            "mark": {
                "type": "circle",
                "size": 170,
                "opacity": 0.85,
                "stroke": "white",
                "strokeWidth": 1
            },
            "encoding": {
                "x": {
                    "field": "League",
                    "type": "nominal",
                    "title": "League"
                },
                "y": {
                    "field": "TeamScoring",
                    "type": "quantitative",
                    "title": "Team Points Per Game"
                },
                "color": {
                    "field": "League",
                    "type": "nominal",
                    "title": "League"
                },
                "tooltip": [
                    {
                        "field": "League",
                        "type": "nominal",
                        "title": "League"
                    },
                    {
                        "field": "TeamName",
                        "type": "nominal",
                        "title": "Team"
                    },
                    {
                        "field": "TeamScoring",
                        "type": "quantitative",
                        "title": "Estimated Points Per Game",
                        "format": ".1f"
                    },
                    {
                        "field": "TeamTotalPoints",
                        "type": "quantitative",
                        "title": "Total Player Points",
                        "format": ".0f"
                    }
                ]
            }
        }
    ]
};

vegaEmbed("#league_team_scoring", leagueTeamScoringSpec, {
    "actions": false
});

// Idiom10:
const leaguePlayerScoringStyleSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": 850,
    "height": 500,
    "title": "NBL vs NBA Player Scoring Style",

    "layer": [
        {
            "data": nblPlayerData,
            "transform": createNblComparisonPlayerTransforms(),
            "mark": {
                "type": "circle",
                "opacity": 0.65,
                "stroke": "white",
                "strokeWidth": 1
            },
            "encoding": {
                "x": {
                    "field": "ThreePointAttemptsNum",
                    "type": "quantitative",
                    "title": "Three-Point Attempts Per Game",
                    "scale": {
                        "zero": false
                    }
                },
                "y": {
                    "field": "FreeThrowAttemptsNum",
                    "type": "quantitative",
                    "title": "Free Throw Attempts Per Game",
                    "scale": {
                        "zero": false
                    }
                },
                "size": {
                    "field": "PointsNum",
                    "type": "quantitative",
                    "title": "Points Per Game",
                    "scale": {
                        "range": [30, 700]
                    }
                },
                "color": {
                    "field": "League",
                    "type": "nominal",
                    "title": "League"
                },
                "tooltip": [
                    {
                        "field": "League",
                        "type": "nominal",
                        "title": "League"
                    },
                    {
                        "field": "Player",
                        "type": "nominal",
                        "title": "Player"
                    },
                    {
                        "field": "Team",
                        "type": "nominal",
                        "title": "Team"
                    },
                    {
                        "field": "PointsNum",
                        "type": "quantitative",
                        "title": "Points",
                        "format": ".1f"
                    },
                    {
                        "field": "ThreePointAttemptsNum",
                        "type": "quantitative",
                        "title": "3PA",
                        "format": ".1f"
                    },
                    {
                        "field": "FreeThrowAttemptsNum",
                        "type": "quantitative",
                        "title": "FTA",
                        "format": ".1f"
                    },
                    {
                        "field": "EffectiveFieldGoalPctNum",
                        "type": "quantitative",
                        "title": "eFG %",
                        "format": ".1f"
                    }
                ]
            }
        },
        {
            "data": nbaPerGameComparisonData,
            "transform": createNbaComparisonPlayerTransforms(),
            "mark": {
                "type": "circle",
                "opacity": 0.65,
                "stroke": "white",
                "strokeWidth": 1
            },
            "encoding": {
                "x": {
                    "field": "ThreePointAttemptsNum",
                    "type": "quantitative",
                    "title": "Three-Point Attempts Per Game",
                    "scale": {
                        "zero": false
                    }
                },
                "y": {
                    "field": "FreeThrowAttemptsNum",
                    "type": "quantitative",
                    "title": "Free Throw Attempts Per Game",
                    "scale": {
                        "zero": false
                    }
                },
                "size": {
                    "field": "PointsNum",
                    "type": "quantitative",
                    "title": "Points Per Game",
                    "scale": {
                        "range": [30, 700]
                    }
                },
                "color": {
                    "field": "League",
                    "type": "nominal",
                    "title": "League"
                },
                "tooltip": [
                    {
                        "field": "League",
                        "type": "nominal",
                        "title": "League"
                    },
                    {
                        "field": "Player",
                        "type": "nominal",
                        "title": "Player"
                    },
                    {
                        "field": "Team",
                        "type": "nominal",
                        "title": "Team"
                    },
                    {
                        "field": "Pos",
                        "type": "nominal",
                        "title": "Position"
                    },
                    {
                        "field": "PointsNum",
                        "type": "quantitative",
                        "title": "Points",
                        "format": ".1f"
                    },
                    {
                        "field": "ThreePointAttemptsNum",
                        "type": "quantitative",
                        "title": "3PA",
                        "format": ".1f"
                    },
                    {
                        "field": "FreeThrowAttemptsNum",
                        "type": "quantitative",
                        "title": "FTA",
                        "format": ".1f"
                    },
                    {
                        "field": "EffectiveFieldGoalPctNum",
                        "type": "quantitative",
                        "title": "eFG %",
                        "format": ".1f"
                    }
                ]
            }
        }
    ]
};

vegaEmbed("#league_player_scoring_style", leaguePlayerScoringStyleSpec, {
    "actions": false
});

// Idiom11:
const leaguePlayerEfficiencySpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": 850,
    "height": 500,
    "title": "NBL vs NBA Player Scoring Efficiency",

    "layer": [
        {
            "data": nblPlayerData,
            "transform": createNblComparisonPlayerTransforms(),
            "mark": {
                "type": "circle",
                "opacity": 0.65,
                "stroke": "white",
                "strokeWidth": 1
            },
            "encoding": {
                "x": {
                    "field": "EffectiveFieldGoalPctNum",
                    "type": "quantitative",
                    "title": "Effective Field Goal Percentage (%)",
                    "scale": {
                        "zero": false
                    }
                },
                "y": {
                    "field": "PointsNum",
                    "type": "quantitative",
                    "title": "Points Per Game",
                    "scale": {
                        "zero": false
                    }
                },
                "size": {
                    "field": "MinutesNum",
                    "type": "quantitative",
                    "title": "Minutes Per Game",
                    "scale": {
                        "range": [30, 700]
                    }
                },
                "color": {
                    "field": "League",
                    "type": "nominal",
                    "title": "League"
                },
                "tooltip": [
                    {
                        "field": "League",
                        "type": "nominal",
                        "title": "League"
                    },
                    {
                        "field": "Player",
                        "type": "nominal",
                        "title": "Player"
                    },
                    {
                        "field": "Team",
                        "type": "nominal",
                        "title": "Team"
                    },
                    {
                        "field": "PointsNum",
                        "type": "quantitative",
                        "title": "Points",
                        "format": ".1f"
                    },
                    {
                        "field": "MinutesNum",
                        "type": "quantitative",
                        "title": "Minutes",
                        "format": ".1f"
                    },
                    {
                        "field": "EffectiveFieldGoalPctNum",
                        "type": "quantitative",
                        "title": "eFG %",
                        "format": ".1f"
                    },
                    {
                        "field": "ThreePointAttemptsNum",
                        "type": "quantitative",
                        "title": "3PA",
                        "format": ".1f"
                    },
                    {
                        "field": "FreeThrowAttemptsNum",
                        "type": "quantitative",
                        "title": "FTA",
                        "format": ".1f"
                    }
                ]
            }
        },
        {
            "data": nbaPerGameComparisonData,
            "transform": createNbaComparisonPlayerTransforms(),
            "mark": {
                "type": "circle",
                "opacity": 0.65,
                "stroke": "white",
                "strokeWidth": 1
            },
            "encoding": {
                "x": {
                    "field": "EffectiveFieldGoalPctNum",
                    "type": "quantitative",
                    "title": "Effective Field Goal Percentage (%)",
                    "scale": {
                        "zero": false
                    }
                },
                "y": {
                    "field": "PointsNum",
                    "type": "quantitative",
                    "title": "Points Per Game",
                    "scale": {
                        "zero": false
                    }
                },
                "size": {
                    "field": "MinutesNum",
                    "type": "quantitative",
                    "title": "Minutes Per Game",
                    "scale": {
                        "range": [30, 700]
                    }
                },
                "color": {
                    "field": "League",
                    "type": "nominal",
                    "title": "League"
                },
                "tooltip": [
                    {
                        "field": "League",
                        "type": "nominal",
                        "title": "League"
                    },
                    {
                        "field": "Player",
                        "type": "nominal",
                        "title": "Player"
                    },
                    {
                        "field": "Team",
                        "type": "nominal",
                        "title": "Team"
                    },
                    {
                        "field": "Pos",
                        "type": "nominal",
                        "title": "Position"
                    },
                    {
                        "field": "PointsNum",
                        "type": "quantitative",
                        "title": "Points",
                        "format": ".1f"
                    },
                    {
                        "field": "MinutesNum",
                        "type": "quantitative",
                        "title": "Minutes",
                        "format": ".1f"
                    },
                    {
                        "field": "EffectiveFieldGoalPctNum",
                        "type": "quantitative",
                        "title": "eFG %",
                        "format": ".1f"
                    },
                    {
                        "field": "ThreePointAttemptsNum",
                        "type": "quantitative",
                        "title": "3PA",
                        "format": ".1f"
                    },
                    {
                        "field": "FreeThrowAttemptsNum",
                        "type": "quantitative",
                        "title": "FTA",
                        "format": ".1f"
                    }
                ]
            }
        }
    ]
};

vegaEmbed("#league_player_efficiency", leaguePlayerEfficiencySpec, {
    "actions": false
});