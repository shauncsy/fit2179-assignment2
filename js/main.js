
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