module.exports = ({ env }) => ({
  plugins: {
    autoprefixer: {
      grid: true,
    },
    perfectionist: {
      indentSize: 2,
      format: 'expanded',
    },
    cssnano: env === 'production' ? { preset: 'default' } : false,
  },
});
