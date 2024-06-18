import '@testing-library/jest-dom';
import { render, screen, waitFor,cleanup, fireEvent  } from '@testing-library/react';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import userEvent from '@testing-library/user-event';
import mockRouter from 'next-router-mock';
import Favourites from '../favourites/page';
import { server } from "../../mocks/server";
import { rest } from "msw"
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

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

jest.mock('js-cookie', () => ({
  set: jest.fn(),
  get: jest.fn()
}));

beforeAll(() => server.listen()); // Start MSW before all tests
beforeEach(() => {
  mockRouter.setCurrentUrl('/favourites'); // Set the initial URL
});
afterEach(() => {
  server.resetHandlers(); // Reset handlers after each test
  cleanup(); // Cleanup after each test if using React Testing Library
});

afterAll(() => server.close()); // Stop MSW after all tests
    
  describe("Favourites Page Tests", () => {
    describe("render", ()=>{
      it('タイトル、ボタン２つ: スライドとリスト、ホームボタンが表示されている。', async () => {
        render(
          <ChakraProvider theme={extendTheme()}>
          <Favourites />
        </ChakraProvider>
        )

        const title = screen.getByText("お気に入り名言リスト");
        const slideButton = screen.getByText("スライド");
        const listButton = screen.getByText("リスト");
        const homeButton = screen.getByText("ホーム");
        expect(title).toBeInTheDocument;
        expect(slideButton).toBeInTheDocument;
        expect(listButton).toBeInTheDocument;
        expect(homeButton).toBeInTheDocument;
      });
    })
    describe("behaviour", ()=>{
      it("お気に入りが空の場合、名言はありませんというメッセージが表示される。", async()=>{
        render(
          <ChakraProvider theme={extendTheme()}>
          <Favourites />
          </ChakraProvider>
        )
        const message = await screen.findByText("お気に入りリストに名言はありません。");
        expect(message).toBeInTheDocument;
      })

      it("お気に入りに名言が１つある場合、、名言数は１と表示される。", async()=>{
         render(
          <ChakraProvider theme={extendTheme()}>
          <Favourites />
          </ChakraProvider>
        )

        server.use(
          rest.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/favourites/getQuotes/:userId`, (req, res, ctx) => {
           return res(ctx.status(200), ctx.json([
              {
                  "id": 214,
                  "quoteId": 78,
                  "author": "ヘンリー・フォード",
                  "language": 1,
                  "quote": "失敗は、よりよい方法でやり直すための機会に過ぎない。",
                  "created_at": "2024-06-06"
              },
              {
                  "id": 215,
                  "quoteId": 78,
                  "author": "Henry Ford",
                  "language": 2,
                  "quote": "Failure is simply the opportunity to begin again, this time more intelligently.",
                  "created_at": "2024-06-06"
              },
              {
                  "id": 216,
                  "quoteId": 78,
                  "author": "헨리 포드",
                  "language": 3,
                  "quote": "실패는 더 나은 방법으로 다시 시작할 기회에 불과하다.",
                  "created_at": "2024-06-06"
              }
         ]));
         })
       );

        const countDisplay = await waitFor(() => screen.getByText("名言数 1"));
        expect(countDisplay).toBeInTheDocument();
      })

      it("ホームボタンを押すとホームページに戻る。", async ()=>{
        render( <ChakraProvider theme={extendTheme()}>
                <Favourites />
                </ChakraProvider>, { wrapper: MemoryRouterProvider })
        await userEvent.click(screen.getByText('ホーム'));
        expect(mockRouter.asPath).toEqual('/')
      })
      
    });
  });