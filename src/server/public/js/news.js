(async () => {
    const createElement = (item) => {
        const div = document.createElement('div');
        div.classList.add('col-lg-6', 'col-sm-12', 'my-2');
        // note: not all feeds have the same fields, needs good filtering
        div.innerHTML = `
        <div class="card">
            <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">${item.contentSnippet || item.content}</p>
            <a href="${item.link}" class="btn btn-primary">Read more</a>
            </div>
            <div class="card-footer text-muted">
                ${item.isoDate || item.pubDate || ""}
            </div>
        </div>
        `;
        return div;
    };
    const fetchData = async (feed) => {
        const response = await fetch(`/api/news/${feed}`);
        const data = await response.json();
        console.log(data);
        // clear container before displaying new data
        container.innerHTML = "";
        data.forEach(item => {
            const el = createElement(item);
            container.appendChild(el);
        });
    };

    const dropdown = document.getElementById('rss-feed');
    dropdown.value = dropdown.item(0).value; // reset dropdown to default (FIRST) value
    dropdown.addEventListener('change', async e => {
        let choice = e.target.value;
        if (choice == "custom") {
            const { value: url } = await Swal.fire({
                title: 'Input custom RSS feed URL',
                input: 'url',
                inputLabel: 'Custom RSS feeds may be displayed incorrectly.',
                inputPlaceholder: 'Example: https://www.reddit.com/.rss'
            });

            if (url) {
                choice = `custom?feedurl=${url}`;
            } else {
                return;
            }
        }
        fetchData(choice);
    });
    const container = document.getElementById("rss-container");
    fetchData("bbc");
})();
