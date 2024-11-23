import { Fragment, useState, useMemo } from 'react';
import { JsonForms } from '@jsonforms/react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './App.css';
import schema from './schema.json';
import uischema from './uischema.json';
import { materialCells, materialRenderers } from '@jsonforms/material-renderers';
import RatingControl from './components/RatingControl';
import ratingControlTester from './ratingControlTester';
import TextDisplay, { textTester } from './TextDisplay';
import { makeStyles } from '@mui/styles';
import { useFigTreeEvaluator } from './useFigTreeEvaluator';
import { Link } from '@mui/material';

const useStyles = makeStyles({
  container: {
    padding: '1em',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    padding: '0.25em',
  },
  dataContent: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '0.25em',
    backgroundColor: '#cecece',
    marginBottom: '1rem',
  },
  resetButton: {
    margin: 'auto !important',
    display: 'block !important',
  },
  demoform: {
    margin: 'auto',
    padding: '1rem',
  },
});

const initialData = {
  number1: 2,
  number2: 2,
  vegetarian: false,
};

const renderers = [
  ...materialRenderers,
  //register custom renderers
  { tester: ratingControlTester, renderer: RatingControl },
  { tester: textTester, renderer: TextDisplay },
];

const App = () => {
  const classes = useStyles();
  const [data, setData] = useState<any>(initialData);
  const stringifiedData = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const { evaluatedSchema = {}, evaluatedUiSchema } = useFigTreeEvaluator(data, schema, uischema);

  const clearData = () => {
    setData({});
  };

  return (
    <Fragment>
      <div className='App'>
        <header className='App-header'>
          {/* <img src={logo} className='App-logo' alt='logo' /> */}
          <h1 className='App-title'>Welcome to JSON Forms with React</h1>
          <p className='App-intro'>
            Enhanced with{' '}
            <Link href='https://github.com/CarlosNZ/fig-tree-evaluator' target='_blank'>
              FigTree Evaluator
            </Link>
          </p>
        </header>
      </div>

      <Grid container justifyContent={'center'} spacing={1} className={classes.container}>
        <Grid item sm={6}>
          <Typography variant={'h4'} className={classes.title}>
            Bound data
          </Typography>
          <div className={classes.dataContent}>
            <pre id='boundData'>{stringifiedData}</pre>
          </div>
          <Button className={classes.resetButton} onClick={clearData} color='primary' variant='contained'>
            Clear data
          </Button>
        </Grid>
        <Grid item sm={6}>
          <Typography variant={'h4'} className={classes.title}>
            Rendered form
          </Typography>
          <div className={classes.demoform}>
            <JsonForms
              schema={evaluatedSchema}
              uischema={evaluatedUiSchema}
              data={data}
              renderers={renderers}
              cells={materialCells}
              onChange={({ errors, data }) => setData(data)}
            />
          </div>
        </Grid>
        <Typography fontSize='80%'>
          Repository for this demo:{' '}
          <Link href='https://github.com/CarlosNZ/jsonforms-with-figtree-demo' target='_blank'>
            Github
          </Link>
        </Typography>
      </Grid>
    </Fragment>
  );
};

export default App;
