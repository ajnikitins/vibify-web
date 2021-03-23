import {BoxPlotChart} from "@sgratzl/chartjs-chart-boxplot";
import {quickScore} from "quick-score";
import {debounce, fitsConstraints} from "./utils";

export class SongList {
  constructor(listContainer, searchInput, filterContainer, chartContext, createButton, resetButton) {
    this.listContainer = listContainer;

    this.searchInput = searchInput;
    this.searchInput.addEventListener('input',
        debounce(200, this.filterSongList.bind(this)));

    this.filterContainer = filterContainer;
    for (const filterRow of this.filterContainer.children) {
      for (const filterCol of filterRow.children) {
        filterCol.children[0].children[2].addEventListener("input",
            debounce(200, this.filterSongList.bind(this)));

        filterCol.children[0].children[1].addEventListener("change",
            debounce(200, this.filterSongList.bind(this)));
      }
    }

    this.chartContext = chartContext;

    this.createButton = createButton;
    this.resetButton = resetButton;
    this.resetButton.addEventListener('click', this.clearSearchFilters.bind(this));

    this.songs = [];
    this.audioFeatures = {};

    this.selectedSongId = "";

    this.chart = null;
  }

  setSongData(songData) {
    this.songs = songData;
  }

  getSong(id) {
    return this.songs.find((song) => song.id === id);
  }

  filterSongList() {
    const constraints = {};

    for (const filterRow of this.filterContainer.children) {
      for (const filterCol of filterRow.children) {
        const filter = filterCol.children[0];

        const feature = filter.dataset.filter;
        const cmp = parseInt(filter.children[1].value);
        const val = parseFloat(filter.children[2].value);

        constraints[feature] = { cmp, val };
      }
    }

    const pattern = this.searchInput.value;

    for (const song of this.songs) {
      const songElement = document.getElementById(`song-${song.id}`);
      const searchThreshold = 0.4;

      if ((pattern === ""
          || quickScore(song.name, pattern) >= searchThreshold
          || quickScore(song.artistName, pattern) >= searchThreshold
          || quickScore(song.albumName, pattern) >= searchThreshold)
          && fitsConstraints(song.audioFeatures, constraints)) {
          songElement.classList.remove("visually-hidden");
          song.isFiltered = false;
      } else {
        songElement.classList.add("visually-hidden");
        song.isFiltered = true;
      }
    }

    this.createSongChart(true)
  }

  clearSearchFilters() {
    this.searchInput.value = "";

    for (const filterRow of this.filterContainer.children) {
      for (const filterCol of filterRow.children) {
        const filter = filterCol.children[0];

        filter.children[1].value = 2;
        filter.children[2].value = 0;
      }
    }

    this.filterSongList();
  }

  renderSongList() {
    while (this.listContainer.firstChild) {
      this.listContainer.removeChild(this.listContainer.firstChild);
    }

    for (const song of this.songs) {
      let item;

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

      this.listContainer.appendChild(item);
    }

    this.createSongChart();
  }

  constructAudioFeatures(filter = false) {
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
      if (!filter || !song.isFiltered) {
        for (const feature in audioFeatures) {
          if (Object.prototype.hasOwnProperty.call(audioFeatures, feature)) {
            audioFeatures[feature].push(song.audioFeatures[feature]);
          }
        }
      }
    }

    return audioFeatures;
  }

  createSongChart(filter = false) {
    this.audioFeatures = this.constructAudioFeatures(filter);
    if (this.chart === null) {
      this.chart = new BoxPlotChart(this.chartContext, {
        // The data for our dataset
        data: {
          labels: [
            "Acousticness", "Danceability", "Energy", "Instrumentalness",
            "Liveness", "Speechiness", "Valence"
          ],
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
          },
          maintainAspectRatio: false,
        }
      });
    } else {
      this.chart.data.datasets[0].data = [
        this.audioFeatures.acousticness,
        this.audioFeatures.danceability,
        this.audioFeatures.energy,
        this.audioFeatures.instrumentalness,
        this.audioFeatures.liveness,
        this.audioFeatures.speechiness,
        this.audioFeatures.valence
      ];
      this.chart.update();
    }
  }
}
