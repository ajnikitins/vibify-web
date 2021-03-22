import {BoxPlotChart} from "@sgratzl/chartjs-chart-boxplot";
import {quickScore} from "quick-score";

export class SongList {
  constructor(container) {
    this.container = container;
    this.songs = [];
    this.songHTML = new Map();

    this.audioFeatures = {};

    this.selectedSongId = "";

    this.chart = null;
  }

  setSongData(songData) {
    this.songs = songData;
    this.audioFeatures = this.constructAudioFeatures();
  }

  getSong(id) {
    return this.songs.find((song) => song.id === id);
  }

  filterSongList() {
    const pattern = document.getElementById("input-search").value;

    for (const song of this.songs) {
      const songElement = document.getElementById(`song-${song.id}`);
      const searchThreshold = 0.4;

      if (pattern === ""
          || quickScore(song.name, pattern) >= searchThreshold
          || quickScore(song.artistName, pattern) >= searchThreshold
          || quickScore(song.albumName, pattern) >= searchThreshold) {
          songElement.classList.remove("visually-hidden");
      } else {
        songElement.classList.add("visually-hidden");
      }
    }
  }

  renderSongList() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    for (const song of this.songs) {
      let item;

      if (this.songHTML.has(song.id)) {
        console.log(1);
        item = this.songHTML.get(song.id);
      } else {
        item = document.createElement("a");
        item.classList.add("list-group-item", "list-group-item-action");
        item.id = `song-${song.id}`;

        item.innerHTML = `
        <div class="d-flex align-items-center">
          <img class="me-3" width=40px src="${song.images[2].url}" alt="Album art for ${song.name}">
          <div class="d-inline-block text-truncate">
            <div class="fs-6 text-truncate fw-bold">${song.name}</div>
            <div class="text-muted text-truncate">${song.artistName}</div>
          </div>
        </div>`;

        item.addEventListener('click', (ev) => {
          ev.preventDefault();

          if (this.selectedSongId === song.id) {
            item.classList.remove("active");
            this.selectedSongId = "";
          } else {
            const prevSongElement = document.getElementById(
                `song-${this.selectedSongId}`);

            if (prevSongElement !== null) {
              prevSongElement.classList.remove("active");
            }
            item.classList.add("active");

            this.selectedSongId = song.id;
          }
        });

        this.songHTML.set(song.id, item);
      }

      this.container.appendChild(item);
    }
  }

  constructAudioFeatures() {
    const audioFeatures = {
      acousticness: [],
      danceability: [],
      energy: [],
      instrumentalness: [],
      liveness: [],
      speechiness: [],
      valence: [],
      loudness: [],
      tempo: [],
      duration_ms: []
    };

    for (const song of this.songs) {
      for (const feature in audioFeatures) {
        if (Object.prototype.hasOwnProperty.call(audioFeatures, feature)) {
          audioFeatures[feature].push(song.audioFeatures[feature]);
        }
      }
    }

    return audioFeatures;
  }

  createSongChart(ctx) {
    console.log(this.audioFeatures);
    if (this.chart === null) {
      this.chart = new BoxPlotChart(ctx, {
        // The data for our dataset
        data: {
          labels: ["Acousticness", "Danceability", "Energy", "Instrumentalness", "Liveness", "Speechiness", "Valence"],
          datasets: [{
            label: 'a',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [
              this.audioFeatures.acousticness,
              this.audioFeatures.danceability,
              this.audioFeatures.energy,
              this.audioFeatures.instrumentalness,
              this.audioFeatures.liveness,
              this.audioFeatures.speechiness,
              this.audioFeatures.valence
            ]
          }]
        },

        // Configuration options go here
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    } else {
      this.chart.update();
    }
  }
}
