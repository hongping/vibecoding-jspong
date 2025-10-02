const baseSpeedInput = document.getElementById('baseSpeed');
const maxSpeedInput = document.getElementById('maxSpeed');
const exponentInput = document.getElementById('exponent');
const ctx = document.getElementById('difficultyChart').getContext('2d');

let chart;

function calculateSpeeds(base, max, exponent) {
    const speeds = [];
    for (let level = 1; level <= 5; level++) {
        // The formula for the curve:
        // base + ((level - 1) / 4)^exponent * (max - base)
        const speed = base + Math.pow((level - 1) / 4, exponent) * (max - base);
        speeds.push(speed.toFixed(4)); // Format to 4 decimal places
    }
    return speeds;
}

function createOrUpdateChart() {
    const baseSpeed = parseFloat(baseSpeedInput.value);
    const maxSpeed = parseFloat(maxSpeedInput.value);
    const exponent = parseFloat(exponentInput.value);

    if (isNaN(baseSpeed) || isNaN(maxSpeed) || isNaN(exponent)) {
        return;
    }

    const speeds = calculateSpeeds(baseSpeed, maxSpeed, exponent);
    const labels = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'];

    if (chart) {
        chart.data.datasets[0].data = speeds;
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Computer AI Speed',
                    data: speeds,
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    tension: 0.2 // Slightly curve the line itself for aesthetics
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff'
                        }
                    }
                }
            }
        });
    }
}

baseSpeedInput.addEventListener('input', createOrUpdateChart);
maxSpeedInput.addEventListener('input', createOrUpdateChart);
exponentInput.addEventListener('input', createOrUpdateChart);

// Initial chart creation
createOrUpdateChart();