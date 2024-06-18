// Page.test.tsx
import '@testing-library/jest-dom';
import { render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockRouter from 'next-router-mock';
import Login from '../(auth)/login/page';

// mock next nevigation 
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

beforeEach(() => {
  mockRouter.setCurrentUrl('/login'); // Set the initial URL
});

function getEmail(){
  return screen.getByLabelText(/メールアドレス/i);
}

function getPassword(){
  return screen.getByLabelText(/パスワード/i);
}

describe("Login Page Tests", () => {
  describe("render", ()=>{
    it('e-mailとパスワードのインプットフィールドが存在する', async () => {
      render(<Login />);
      const emailInput = getEmail();
      const passwordInput = getPassword();
      const submitButton = screen.getByRole('button', { name: /ログイン/i });
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
 
    });
  })
  describe("behaviour", ()=>{
    it('ユーザーがフォーマットが正しくないーメールアドレスを入力するとエラーが表示される。', async () => {
      render(<Login />);
      const emailInput = getEmail();
      await userEvent.type(emailInput, 'test');
      expect(emailInput).toHaveValue("test")
      const errorMessage = screen.getByText("Invalid email address");
      expect(errorMessage).toBeInTheDocument();
    })

    it('ユーザーが正しくないパスワードを入力するとエラーが表示される。', async () => {
    render(<Login />);
    const passwordInput = getPassword();
    await userEvent.type(passwordInput, '123');
    const errorMessage = screen.getByText('Password must be at least 10 characters');
    expect(passwordInput).toHaveValue("123")
    expect(errorMessage).toBeInTheDocument;
  })

  it('ユーザーが正しいe-mailとパスワードを入力せず、ログインボタンを押すとエラーがでる。', async () => {
    render(<Login />);
    const submitButton = screen.getByRole('button', { name: /ログイン/i });
    expect(submitButton).toBeInTheDocument();
    await userEvent.click(submitButton);
    const emailErrorMessage = screen.getByText('Password must be at least 10 characters');
    const passwordErrorMessage = screen.getByText("Invalid email address");
    expect(emailErrorMessage).toBeInTheDocument;
    expect(passwordErrorMessage).toBeInTheDocument;
  })

});

});











