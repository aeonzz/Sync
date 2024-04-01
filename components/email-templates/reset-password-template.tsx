

interface ResetPasswordTemplateProps {
  email: string;
  resetPasswordToken: string
}

const ResetPasswordTemplate: React.FC<ResetPasswordTemplateProps> = ({email, resetPasswordToken}) => {
  return (
    <div>
      <a href={`http://localhost:3000/auth/reset-password?token=${resetPasswordToken}`}>
        Reset your fucking password
      </a>
    </div>
  )
}

export default ResetPasswordTemplate