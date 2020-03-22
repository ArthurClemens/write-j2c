module.exports = [
  {
    '.red.strong': {
      color: '#f00',
      fontWeight: 'bold'
    }
  },
  {
    '.header': [
      {
        '&.h1': {
          'font-weight': 'bold'
        }
      },
      {
        '&.h1': {
          'color': '#000'
        }
      }
    ]
  },
  {
    '.pe-dark-tone.pe-svg.test-theme-svg-1,.pe-dark-tone .pe-svg.test-theme-svg-1': {
      ' svg': {
        ' path, rect, circle, polygon': {
          '&:not([fill=none])': {
            fill: 'orange',
          },
        },
      },
    },
  },
  {
    '.pe-svg.test-theme-svg-1,.pe-light-tone.pe-svg.test-theme-svg-1,.pe-light-tone .pe-svg.test-theme-svg-1': {
      ' svg': {
        ' path, rect, circle, polygon': {
          '&:not([fill=none])': {
            fill: '#0D47A1',
          },
        },
      },
    },
  },
  {
    '.pe-dark-tone.pe-svg.test-theme-svg-2,.pe-dark-tone .pe-svg.test-theme-svg-2': {
      ' svg': {
        ' path, rect, circle, polygon': {
          '&:not([fill=none])': {
            fill: 'red',
          },
        },
      },
    },
  },
  {
    '.pe-svg.test-theme-svg-2,.pe-light-tone.pe-svg.test-theme-svg-2,.pe-light-tone .pe-svg.test-theme-svg-2': {
      ' svg': {
        ' path, rect, circle, polygon': {
          '&:not([fill=none])': {
            fill: 'green',
          },
        },
      },
    },
  },
];
