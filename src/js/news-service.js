import axios from 'axios';

const IPI_KEY = '30362375-b667f06e2aa263e68d53d2cf4';

export default class NewsApiService {
  constructor() {
    this.search = '';
    this.page = 1;
  }

  async fetchArticles() {
    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: IPI_KEY,
          q: `${this.search}`,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: 40,
          page: `${this.page}`,
        },
      });
      this.incscrementPage();
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  incscrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.search;
  }

  set query(newQuery) {
    this.search = newQuery;
  }
}
