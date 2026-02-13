import { motion } from 'framer-motion';

export default function NeonButton({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variants = {
    primary: `
      bg-neon-red/10 text-neon-red border border-neon-red
      hover:bg-neon-red hover:text-white hover:shadow-neon
    `,
    secondary: `
      bg-transparent text-white border border-white/30
      hover:border-neon-red hover:text-neon-red hover:shadow-neon-sm
    `,
    ghost: `
      bg-transparent text-gray-400 border border-transparent
      hover:text-neon-red hover:border-neon-red/30
    `,
    solid: `
      bg-neon-red text-white border border-neon-red shadow-neon-sm
      hover:bg-neon-red/80 hover:shadow-neon
    `,
  };

  const baseClasses = `
    inline-flex items-center justify-center font-semibold rounded-lg
    transition-all duration-300 ease-out cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizes[size]} ${variants[variant]} ${className}
  `;

  const Component = href ? 'a' : 'button';

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
    >
      <Component
        href={href}
        onClick={onClick}
        disabled={disabled}
        type={href ? undefined : type}
        className={baseClasses}
        {...props}
      >
        {children}
      </Component>
    </motion.div>
  );
}
