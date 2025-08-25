import { FC } from 'react';
import { Button } from '@/components/ui/button';

interface TwitterLoginButtonProps {
  onLogin: () => void;
}

export const TwitterLoginButton: FC<TwitterLoginButtonProps> = ({
  onLogin,
}) => {
  return (
    <Button
      onClick={onLogin}
      className="bg-[#1DA1F2] hover:bg-[#1a91da] text-white"
    >
      Connect Twitter Account
    </Button>
  );
};
