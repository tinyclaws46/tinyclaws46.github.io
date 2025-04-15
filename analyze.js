(() => {
    const selectors = {
      textInput: document.getElementById("textInput"),
      results: document.getElementById("results")
    };
  
    const tokens = {
      pronouns: ['he', 'she', 'it', 'they', 'we', 'i', 'you', 'him', 'her', 'us', 'them', 'his', 'my', 'mine', 'yours', 'ours', 'theirs'],
      prepositions: ['in', 'on', 'at', 'by', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'of', 'off', 'over', 'under'],
      articles: ['a', 'an']
    };
  
    function countOccurrences(pattern, text) {
      return (text.match(pattern) || []).length;
    }
  
    function countTokenFrequency(text, list) {
      const words = text.toLowerCase().match(/\b\w+\b/g) || [];
      const frequency = {};
      list.forEach(word => frequency[word] = 0);
      words.forEach(word => {
        if (frequency.hasOwnProperty(word)) {
          frequency[word]++;
        }
      });
      return frequency;
    }
  
    function createCard(title, items) {
      const entries = Object.entries(items).filter(([_, value]) => value > 0);
      if (!entries.length) return '';
      const content = entries.map(([key, val]) => `<li><strong>${key}</strong>: ${val}</li>`).join('');
      return `
        <div class="result-card">
          <h4>${title}</h4>
          <ul>${content}</ul>
        </div>
      `;
    }
  
    window.analyzeText = () => {
      const text = selectors.textInput.value;
  
      const analysis = {
        Letters: countOccurrences(/[a-zA-Z]/g, text),
        Words: countOccurrences(/\b\w+\b/g, text),
        Spaces: countOccurrences(/ /g, text),
        Newlines: countOccurrences(/\n/g, text),
        "Special Symbols": countOccurrences(/[^a-zA-Z0-9\s]/g, text)
      };
  
      const tokenData = {
        "Pronoun Frequency": countTokenFrequency(text, tokens.pronouns),
        "Preposition Frequency": countTokenFrequency(text, tokens.prepositions),
        "Article Frequency": countTokenFrequency(text, tokens.articles)
      };
  
      const resultHTML = `
        <div class="result-section">
          <h3>Basic Analysisof the text -> </h3>
          <div class="result-card">
            <ul>
              ${Object.entries(analysis).map(([k, v]) => `<li><strong>${k}</strong>: ${v}</li>`).join('')}
            </ul>
          </div>
          ${Object.entries(tokenData).map(([title, data]) => createCard(title, data)).join('')}
        </div>
      `;
  
      selectors.results.innerHTML = resultHTML;
    };
  })();
  