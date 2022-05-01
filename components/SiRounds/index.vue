<template>
<div class="sir-content">
  <div class="sir-menu">
    <div class="sir-themes">
      <div
        :class="['sir-pack-loader', packDraggedOver ? 'dragged' : '']"
        @drop="onPackDrop"
        @dragenter="onPackDragEnter"
        @dragover="e => e.preventDefault()"
        @dragleave="onPackDragLeave"
      >
        <div>ПЕРЕМЕСТИТЬ ФАЙЛ ДЛЯ ЗАГРУЗКИ</div>
        <div>
          <label class="upload-pack-label" for="upload-pack-button">или выбрать</label>
          <input id="upload-pack-button" type="file" @change="uploadPack" />
        </div>
      </div>
      <div class="sir-author" v-for="(author, i) in authors" :key="'author-' + i">{{ author.textContent }}</div>
      <div class="sir-round" v-for="(round, i) in rounds" :key="'round' + i">
        <div class="sir-round-name">{{ round.getAttribute('name') }}</div>
        <div
          :class="['sir-theme-name', theme == activeTheme ? 'active' : '']"
          v-for="(theme, j) in getThemes(round)"
          :key="'theme-' + j"
          @click="setTheme(theme)"
        >
          {{ theme.getAttribute('name') }}
        </div>
      </div>
    </div>
  </div>
  <div class="sir-theme">
    <si-theme :theme="activeTheme" :pack="zipfile" />
  </div>
</div>
</template>

<script>
import JSZip from 'jszip'

export default {
  name: 'SiRounds',
  components: {
    SiTheme: () => import('~/components/SiTheme')
  },
  data: () => ({
    content: null,
    activeTheme: null,
    packDraggedOver: false,
    zipfile: null,
    packLink: null
  }),
  methods: {
    getThemes (round) {
      return round.querySelectorAll('themes > theme')
    },
    setTheme (theme) {
      this.activeTheme = theme
    },
    onPackDragEnter (e) {
      e.preventDefault()
      this.packDraggedOver = true
    },
    onPackDragLeave (e) {
      e.preventDefault()
      this.packDraggedOver = false
    },
    async uploadPack (e) {
      console.log(e)
      this.zipfile = new JSZip()
      await this.zipfile.loadAsync(e.target.files[0])
      const xmltext = await this.zipfile.file('content.xml').async('string')
      const parser = new DOMParser()
      this.content = parser.parseFromString(xmltext, 'application/xml')
    },
    async onPackDrop (e) {
      e.preventDefault()
      if (e.dataTransfer.items) {
        for (const item of e.dataTransfer.items) {
          if (item.kind === 'file') {
            const file = item.getAsFile()
            this.zipfile = new JSZip()
            await this.zipfile.loadAsync(file)
            const xmltext = await this.zipfile.file('content.xml').async('string')
            const parser = new DOMParser()
            this.content = parser.parseFromString(xmltext, 'application/xml')
          }
        }
      } else {
        for (const file of e.dataTransfer.files) {
          console.log(file.name)
        }
      }
      this.packDraggedOver = false
    }
  },
  computed: {
    authors () {
      const authors = this.content?.querySelectorAll('package > info > authors > author')
      return authors
    },
    rounds () {
      return this.content?.querySelectorAll('rounds > round')
    }
  }
}
</script>

<style lang="scss" scoped>
.sir-author {
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 2px;
}

.sir-round-name {
  font-weight: bold;
}

.sir-content {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr 4fr;
  gap: 10px;
}

.sir-pack-loader {
  position: sticky;
  top: 0;
  border: 2px dashed #ccc;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
  background-color: white;
  padding: 20px;
}

#upload-pack-button {
  display: none;
}

.upload-pack-label {
  text-decoration: underline;
  cursor: pointer;
}

.upload-pack-label:hover {
  text-decoration: underline;
  color: #444;
}

.sir-pack-loader.dragged {
  background-color: #ccc;
}

.sir-menu {
  max-height: calc(100vh - 20px);
  overflow: auto;
  padding: 10px;
}

.sir-theme {
  max-height: 100vh;
  overflow: auto;
}

.sir-themes {
  display: grid;
  gap: 10px;
}

.sir-round {
  display: grid;
  gap: 10px;
}

.sir-round-name {
  padding: 10px;
  background-color: #888;
  color: white;
  border-radius: 2px;
}

.sir-theme-name {
  padding: 10px;
  background-color: #eee;
  border-radius: 2px;
  cursor: pointer;
}

.sir-theme-name:hover {
  background-color: #ddd;
}

.sir-theme-name.active {
  background-color: #ccc;
}
</style>
