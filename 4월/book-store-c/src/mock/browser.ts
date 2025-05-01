import { setupWorker } from 'msw/browser';
import { addReview, reviewsById, reviewsForMain } from './review';
import { bestBooks } from './books';
import { banners } from './banner';

const handlers = [reviewsById, addReview, reviewsForMain, bestBooks, banners];

export const worker = setupWorker(...handlers);