const fs = require('fs');
const wanakana = require('wanakana');

class FrequencyListConverter {
  constructor(path) {
    this.sourcePath = path;
  }

  get targetJson() {
    let frequencyNum = 0;
    const isArrayType = Array.isArray(this.sourceJson[0]);
    return this.sourceJson.map((wordItem) => {
			if (isArrayType) {
        // ["為る", "freq", {"reading": "する", "frequency": 1}]
        return [wordItem[0], "freq", { "reading": wanakana.toHiragana(wordItem[1]), "frequency": frequencyNum++ }]
      } else {
				// string
				return [wordItem, "freq", frequencyNum++]
      }
    });
  }

  get sourceJson() {
    if (!this._sourceJson) {
      const file = fs.readFileSync(this.sourcePath, 'utf8').trim();
      this._sourceJson = JSON.parse(file);
    }
    return this._sourceJson;
  }
}

(() => {
  const book = new FrequencyListConverter('./data/book_frequency.json');
  const corpus = new FrequencyListConverter('./data/corpus_frequency.json');
  const unknown = new FrequencyListConverter('./data/frequency.json');
	fs.writeFileSync('./outputs/book_frequency_output.json', JSON.stringify(book.targetJson));
	fs.writeFileSync('./outputs/corpus_frequency_output.json', JSON.stringify(corpus.targetJson));
	fs.writeFileSync('./outputs/frequency_output.json', JSON.stringify(unknown.targetJson));
})();
