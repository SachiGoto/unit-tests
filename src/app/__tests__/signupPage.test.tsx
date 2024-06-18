import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockRouter from 'next-router-mock';
import Signup from '../(auth)/signup/page';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';

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
  
  function getUserName(){
    return screen.getByLabelText("ユーザーネーム");
  }
  
  function getEmail(){
    return screen.getByLabelText("メールアドレス");
  }
  
  function getPassword(){
    return screen.getByLabelText("パスワード");
  }

  function getConfirmPassword(){
    return screen.getByLabelText("パスワード確認");
  }
  
  describe("Signup Page Tests", () => {
    describe("render", ()=>{
      it('ユーザーネーム、e-mail、パスワード,確認のインプットフィールドがすべて存在する。', async () => {
        render(<Signup />);
        const title = screen.getByRole("heading",{name:"新規登録"})
        expect(title).toBeInTheDocument;
        expect(getUserName()).toBeInTheDocument();
        expect(getPassword()).toBeInTheDocument();
        expect(getConfirmPassword()).toBeInTheDocument();
        expect(getEmail()).toBeInTheDocument();
        const getSignupButton = screen.getByRole('button',{name:/新規登録/});
        expect(getSignupButton).toBeInTheDocument();
        const getLinkToLogin =screen.getByRole('link', { name: "ログインはこちらから"});
        expect(getLinkToLogin).toBeInTheDocument();

      });
    })

    describe("behaviour", ()=>{
      it('ユーザーがフォーマットが正しくないメールアドレスを入力するとエラーが表示される。', async () => {
        render(<Signup />);
        const emailInput = getEmail();
        await userEvent.type(emailInput, 'test');
        expect(emailInput).toHaveValue("test")
        const errorMessage = screen.getByText("Invalid email address");
        expect(errorMessage).toBeInTheDocument();
    })

    it("ユーザーがログインボタンを押すとログインページにいく。", async ()=>{
      render(<Signup />, 
        { wrapper: MemoryRouterProvider })
      await userEvent.click(screen.getByText("ログインはこちらから"))
      expect(mockRouter.asPath).toEqual('/login')
  })

    describe("email validation tests", ()=>{

      it('パスワードが１０桁以上ないとエラーが表示される。', async () => {
        render(<Signup />);
        const passwordInput = getPassword();
        await userEvent.type(passwordInput, '123');
        const errorMessage = screen.getByText('Password must be at least 10 characters');
        expect(passwordInput).toHaveValue("123")
        expect(errorMessage).toBeInTheDocument;
      }),

      it('パスワードに大文字が最低一つないとエラーが表示される。', async () => {
        render(<Signup />);
        const passwordInput = getPassword();
        await userEvent.type(passwordInput, 'alllowercase');
        const errorMessage = screen.getByText('Password must contain at least one uppercase letter');
        expect(passwordInput).toHaveValue("alllowercase")
        expect(errorMessage).toBeInTheDocument;
      })

      it('パスワードに数字が最低一つないとエラーが表示される。', async () => {
        render(<Signup />);
        const passwordInput = getPassword();
        await userEvent.type(passwordInput, 'noNumbers!');
        const errorMessage = screen.getByText('Password must contain at least one number');
        expect(passwordInput).toHaveValue("noNumbers!")
        expect(errorMessage).toBeInTheDocument;
      })

      it('パスワードにスペシャルキャラクターが最低一つないとエラーが表示される。', async () => {
        render(<Signup />);
        const passwordInput = getPassword();
        await userEvent.type(passwordInput, 'noSpecialCharacters1');
        const errorMessage = screen.getByText('Password must contain at least one special character');
        expect(passwordInput).toHaveValue("noSpecialCharacters1")
        expect(errorMessage).toBeInTheDocument;
      })

      it('もしパスワードがパスワード確認のパスワードと一致しない場合エラーがでる。', async () => {
        render(<Signup />);
        const passwordInput = getPassword();
        const confirmPasswordInput = getConfirmPassword();
        await userEvent.type(passwordInput, 'testPassword123!');
        await userEvent.type(confirmPasswordInput, "testPassword123")
        const errorMessage = screen.getByText("Passwords don't match");
        expect(errorMessage).toBeInTheDocument;
      })
    }
  )
    
  });
  
  });
  
  
  
  
  
  
  
  
  
  
  
  
