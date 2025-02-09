import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#112434',
          secondary: '#5A8EA4',
          accent: '#CD192D',
          error: '#CD192D',
          info: '#4E6EA4',
          success: '#91DA94',
          warning: '#FFA755'
        }
      }
    }
  }
});
