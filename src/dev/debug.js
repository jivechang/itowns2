let _chartCount = 0;
import $script from 'scriptjs';

var canvasJsLoadingPromise;
function loadCanvasJs() {
    if (!canvasJsLoadingPromise) {
        canvasJsLoadingPromise = new Promise(function(resolve) {
             $script.get('http://canvasjs.com/assets/script/canvasjs.min.js', function () {
                resolve(true);
            });
        });
    }
    return canvasJsLoadingPromise;
}

export default function createChart(containerId, title, content) {
    if (__DEV__) {
        loadCanvasJs().then(function() {
            let name = 'debugDiv-' + _chartCount++;
            let d = document.createElement('div');
            d.id = name;
            document.getElementById(containerId).appendChild(d);

            var start = Date.now();

            var chart = new CanvasJS.Chart(
                name,
                { title: { text: title } }
                );

            chart.options.data = [];

            for (let i=0; i<content.data.length; i++) {
                chart.options.data.push({
                    type: 'line',
                    showInLegend: true,
                    name: content.data[i].title,
                    dataPoints: [ ]
                });
            }

            function updateChart() {
                var ts = (Date.now() - start) / 1000;

                let cnt = chart.options.data.length;
                for (let i=0; i<cnt; i++) {
                    chart.options.data[i].dataPoints.push(
                        { x: ts,
                          y: content.data[i].data(content.context)
                        });
                    while (chart.options.data[i].dataPoints.length > 60) {
                        chart.options.data[i].dataPoints.shift();
                    }
                }

                chart.render();
                setTimeout(updateChart, 100);
            }

            setTimeout(updateChart, 100);
        });
    }
}
