import {BoxPlotChart} from "@sgratzl/chartjs-chart-boxplot";

export class SongList {
  constructor(songData) {
    this.songs = new Map();

    songData.forEach((song) => {
      this.songs.set(song.id, song);
    });

    this.audioFeatures = {
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

    this.constructAudioFeatures();

    this.selectedSongId = "";
  }

  getSong(id) {
    return this.songs.get(id);
  }

  createSongListHTML() {
    const items = [];

    for (const song of this.songs.values()) {
      const item = document.createElement("a");
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

      items.push(item);
    }

    return items;
  }

  constructAudioFeatures() {
    for (const song of this.songs.values()) {
      for (const feature in this.audioFeatures) {
        if (Object.prototype.hasOwnProperty.call(this.audioFeatures, feature)) {
          this.audioFeatures[feature].push(song.audioFeatures[feature]);
        }
      }
    }
  }

  createSongChart(ctx) {
    return new BoxPlotChart(ctx, {
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
  }
}
