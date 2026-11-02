
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TaskFlow - Mijn taken</title>
    <link rel="stylesheet" href="assets/style.css">
    <script src="assets/app.js" defer></script>
</head>
<body>

    <header class="topbar">
        <div class="logo">TaskFlow</div>
        <span>Mijn persoonlijke takenplanner</span>
    </header>

    <main class="container">
        <section class="welcome">
            <p class="small-title">MIJN OVERZICHT</p>
            <h1>Welkom bij TaskFlow</h1>
            <p>Houd je taken bij en krijg meer overzicht in je dag.</p>
        </section>

        <section class="stats">
            <div class="stat-card">
                <span>Totaal aantal taken</span>
                <strong id="totalCount">0</strong>
            </div>

            <div class="stat-card">
                <span>Nog te doen</span>
                <strong id="openCount">0</strong>
            </div>

            <div class="stat-card">
                <span>Afgerond</span>
                <strong id="doneCount">0</strong>
            </div>
        </section>

        <section class="panel">
            <h2>Nieuwe taak toevoegen</h2>

            <form id="taskForm">
                <input
                    type="text"
                    id="taskTitle"
                    placeholder="Wat moet je doen?"
                    maxlength="150"
                    required
                >

                <select id="taskPriority">
                    <option value="low">Lage prioriteit</option>
                    <option value="normal" selected>Normale prioriteit</option>
                    <option value="high">Hoge prioriteit</option>
                </select>

                <input type="date" id="taskDue">

                <button type="submit">+ Taak toevoegen</button>
            </form>

            <p id="message"></p>
        </section>

        <section class="panel">
            <div class="list-heading">
                <h2>Mijn taken</h2>

                <input
                    type="search"
                    id="searchInput"
                    placeholder="Zoek een taak..."
                >
            </div>

            <select id="taskFilter">
                <option value="all">Alle taken</option>
                <option value="open">Nog te doen</option>
                <option value="done">Afgerond</option>
            </select>

            <div id="taskList" class="task-list">
                <p>Taken laden...</p>
            </div>
        </section>
    </main>

    <footer>
        <p>TaskFlow - Gemaakt als fullstack schoolproject</p>
    </footer>

</body>
</html>
