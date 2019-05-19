import * as React from 'react';
import {Link} from 'react-router-dom';
import {Toolbar} from '@material-ui/core';
import {Grid} from '@material-ui/core';
import {Button} from '@material-ui/core';
import { styleToolbar } from './SharedStyles';
import '../index.css';
import {style} from "typestyle";

//import styled from 'styled-components';

//const Button = styled.button`
//  &:hover {
//    background:teal;
//  }
//`;

//    color: 'black',
//    "&:hover": {
//      color: 'white'
//    }

const styles: {styleButton: {}} = {
 styleButton: {
    margin: '0px 50px 10px auto',
    fontWeight: '800',
    padding: '5px',
    border: '#1565C0',
    borderStyle: 'solid',
    borderRadius: '10%',
    backgroundColor: '#EA9A40',
 }
};


/** convert a style object to a CSS class name */
const niceColors = style({
  transition: 'color .2s',
  color: 'black',
  $nest: {
    '&:hover': {
      color: 'white'
    }
  }
});

//<h1 className={niceColors}>Hello world</h1>
const MyLoad = (props: any) => <Link to="/load" {...props} />
const MySearch =  (props: any) => <Link to="/search" {...props} />
function Header() {
  return (
    <div>
      <Toolbar style={styleToolbar}>
        <Grid container direction="row" justify="space-around" alignItems="center">
          <Grid item sm={9} xs={8} style={{ paddingTop: '20px', textAlign: 'center' }}>
          <Button component={MyLoad} className={niceColors}
             variant='contained' style={styles.styleButton}>Load</Button>
          <Button component = {MySearch} className={niceColors}
           variant='contained' style={styles.styleButton}>Search</Button>
          </Grid>
        </Grid>
      </Toolbar>
    </div>
  );
}

export default Header;
