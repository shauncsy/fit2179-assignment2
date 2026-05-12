const spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "A simple test bar chart.",
    "data": {
        "values": [
            {"category": "A", "value": 28},
            {"category": "B", "value": 55},
            {"category": "C", "value": 43}
        ]
    },
    "mark": "bar",
    "encoding": {
        "x": {"field": "category", "type": "nominal"},
        "y": {"field": "value", "type": "quantitative"}
    }
};

vegaEmbed("#vis", spec);