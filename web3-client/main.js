import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>Voting Application</h1>
    <button id="connectWallet">Connect Wallet</button>
    <div id="account"></div>

    <div class="cards">
        <div class="card">
            <img src="./sisi.png" alt="Sisi">
            <h2>El Sisi</h2>
            <button class="voteButton" data-candidate-id="0">Vote</button>
        </div>
        <div class="card">
            <img src="./tantawy.png" alt="Ahmed Tantawy">
            <h2>Ahmed Tantawy</h2>
            <button class="voteButton" data-candidate-id="1">Vote</button>
        </div>
    </div>

    <div class="dates">
        <div>Voting Start Time: <span id="startTime"></span></div>
        <div>Voting End Time: <span id="endTime"></span></div>
        <br>
        <div>Current Time: <span id="currentTime"></span></div>
    </div>

    <div>
        <div id="votingStatus"></div>
    </div>

    <div class="winner">
        <button id="showWinner" class="showButton">Show Winner</button>
        <div id="winner"></div>
    </div>
  </div>
`
