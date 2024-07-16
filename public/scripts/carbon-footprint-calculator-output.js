document.addEventListener('DOMContentLoaded', function() {
    const {individualCF, totalCarbonFootprint, treeEquivalent, grade, tips, stats} = JSON.parse(localStorage.getItem('carbonFootprintOutput'));

    console.log(individualCF, totalCarbonFootprint, treeEquivalent, grade, tips, stats);

    if (treeEquivalent) { // that means everything works fine
        
        document.getElementById('carbon-footprint').innerText = totalCarbonFootprint;
        document.getElementById('number-of-trees').innerText = treeEquivalent;
        document.getElementById('grade').innerText = grade.toUpperCase();
        
        // Create a chart to display the user's carbon footprint vs average
        const ctx = document.getElementById('carbon-comparison-chart').getContext('2d');
        const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Car Travel', 'Public Transit', 'Flight', 'Motor Bike', 'Tree Equivalent', 'Total Carbon Footprint'],
            datasets: [
            {
                label: 'Your Carbon Footprint',
                data: [individualCF[0], individualCF[3], individualCF[1], individualCF[2], treeEquivalent, totalCarbonFootprint],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Average Carbon Footprint',
                data: [stats.avgCarTravel, stats.avgPublicTransport, stats.avgFlight, stats.avgMotorBike, stats.avgTreeEquivalent, stats.avgTotalCarbonFootprint ],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
            ],
        },
        options: {
            scales: {
            y: {
                beginAtZero: true
            }
            }
        }
        });

        const tipsContainer = document.getElementById('tips-container');
        tipsContainer.innerHTML = '';
        tips.forEach(tip => {
            const tipCard = document.createElement('div');
            tipCard.className = 'tip card mt-3 pb-1 mx-5 mb-4';
            tipCard.innerHTML = `
                <div class="card-body d-flex flex-column justify-content-between">
                    <h3 class="title">${tip.title}</h3>
                    <p class="description">${tip.description}</p>
                </div>
            `;
            tipsContainer.appendChild(tipCard);
        });
    }
});

