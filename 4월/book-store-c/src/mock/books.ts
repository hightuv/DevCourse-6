import { Book } from '@/models/book.model';
import { fakerKO as faker } from '@faker-js/faker';
import { http, HttpResponse } from 'msw';

const bestBooksData: Book[] = Array.from({ length: 10 }).map((item, index) => ({
  id: index,
  title: faker.lorem.sentence(),
  img: faker.number.int({ min: 100, max: 200 }),
  category_id: faker.number.int({ min: 1, max: 3 }),
  form: '종이책',
  isbn: faker.commerce.isbn(),
  summary: faker.lorem.paragraph(),
  detail: faker.lorem.paragraph(),
  author: faker.person.firstName(),
  pages: faker.number.int({ min: 0, max: 100 }),
  contents: faker.lorem.paragraph(),
  likes: faker.number.int({ min: 0, max: 100 }),
  price: faker.number.int({ min: 10000, max: 50000 }),
  pubDate: faker.date.past().toISOString()
}));

export const bestBooks = http.get('http://localhost:3300/books/best', () => {
  return HttpResponse.json(bestBooksData, {
    status: 200,
  });
});