<template>
<div class="sit-content">
  <div class="sit-header">
    <div v-if="name">Название темы: {{ name }}</div>
    <div class="sit-question-tiles">
      <div class="sit-question-tile" v-for="(question, i) in questions" :key="'question-tile-' + i">
        <div>{{ question.getAttribute('price') }}</div>
      </div>
    </div>
  </div>
  <div class="sit-question" v-for="(question, i) in questions" :key="'question-' + i">
    <div>Цена: {{ question.getAttribute('price') }}</div>
    <div v-for="(item, i) in getAtoms(question)" :key="'atom-' + i">
      <hr v-if="item.getAttribute('type') === 'marker'" />
      <div v-else>
        <img class="sit-atom-image"  v-if="item.getAttribute('type') === 'image'" :src="getResource('image', item.textContent)" />
        <audio v-else-if="item.getAttribute('type') === 'voice'" :src="getResource('voice', item.textContent)" controls=controls />
        <video v-else-if="item.getAttribute('type') === 'video'" :src="getResource('voice', item.textContent)" controls=controls />
        <div v-else>{{ item.textContent }}</div>
      </div>
    </div>
    <hr />
    <div>Правильные ответы: {{ getAnswers(question).join(', ') }}</div>
  </div>
</div>
</template>

<script>
export default {
  name: 'SiTheme',
  props: {
    theme: {
      type: Object,
      default: () => ({})
    },
    pack: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    resources: {}
  }),
  methods: {
    getAtoms (question) {
      return question?.querySelectorAll('scenario > atom')
    },
    getAnswers (question) {
      const answerNodes = question?.querySelectorAll('right > answer')
      const answers = []
      for (const answer of answerNodes) {
        answers.push(answer.textContent)
      }
      return answers
    },
    getResource (type, name) {
      return this.resources[name] ?? null
    },
    async loadResource (type, name) {
      const folder = {
        voice: 'Audio',
        image: 'Images',
        video: 'Video'
      }
      if (!(type in folder)) {
        return null
      }
      const filename = `${folder[type]}/${name}`
      const file = this.pack.file(filename)
      if (file === null) {
        return null
      }
      const blob = await file.async('blob')
      const url = URL.createObjectURL(blob)
      return url
    }
  },
  computed: {
    name () {
      return this.theme?.getAttribute('name')
    },
    questions () {
      return this.theme?.querySelectorAll('questions > question')
    }
  },
  watch: {
    async theme (newTheme) {
      for (const item of newTheme.querySelectorAll('atom[type="image"], atom[type="voice"], atom[type="video"]')) {
        const filename = encodeURI(item.textContent.substring(1))
        this.$set(this.resources, item.textContent, await this.loadResource(item.getAttribute('type'), filename))
      }
    }
  }
}
</script>

<style scoped>
.sit-content {
  display: grid;
  gap: 10px;
  padding: 10px;
  padding-top: 0;
}

.sit-question {
  background-color: #eee;
  padding: 10px;
}

.sit-header {
  position: sticky;
  top: 0;
  background-color: white;
  padding: 10px 0;
  display: grid;
  gap: 10px;
}

.sit-question-tiles {
  display: grid;
  grid-auto-flow: column;
  gap: 10px;
}

.sit-question-tile {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 2px;
  height: 40px;
}

.sit-question-tile div {
  height: min-content;
  width: min-content;
}

.sit-atom-image {
  max-height: 128px;
}
</style>
