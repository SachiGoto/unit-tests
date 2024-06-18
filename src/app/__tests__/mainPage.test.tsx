import '@testing-library/jest-dom';
import { render, screen} from '@testing-library/react';
import mockRouter from 'next-router-mock';
import Home from '../page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
  }),
}));

beforeEach(() => {
    mockRouter.setCurrentUrl('/signup'); // Set the initial URL
  });

    
  describe("Signup Page Tests", () => {
    describe("render", ()=>{
      it('タイトルとボタン２つが表示されている。', async () => {
        render(<Home />);
        const title = screen.getByText("Daily Positive Quotes Generator");
        expect(title).toBeInTheDocument;
      });
    })
  });
