
import * as React from 'react';
import Header from './components/Header';

export class Help extends React.Component<{}> {
    render () {
        return (
//            <div style={{ textAlign: 'center', margin: '0 20px' }}>
<div>
{Header()}
<div style={{textAlign: 'left'}}>

<h2>Load page</h2>
<p>The Load page exits to allow you to update the database.  You will need a VCF file that you have exported from Full Contact.  Which you do by clicking on your picture at the top right of the home page, and then on Account & security, Backup & restore.  On this list of backups click Download for “Yesterday.”  This will let you download a zip file, which you must unzip before you can load it into the database.</p>
<br />
<p>There are two options you can pick when loading the database:</p>
<ul>
<li> Empty the database before loading.  You would want to do this if you have “cleaned up” your FullContacts data, and have removed a bunch of names you no longer want to see in the search results.</li>
<li> Rebuild the categories file.  Only necessary if you have changed the categories around, so that (for example) ‘c’ doesn’t mean what it used to.  Unlikely, I suspect.</li>
</ul>

<p>Just choose the file that you downloaded from Full Contact, and hit Submit.  It takes a while to load the database (about 50 seconds for 10,000 contacts).  Hence the display of “percent complete.”  Although you can navigate away from this page while loading is going on, please don’t initiate any searches.  Correct results are not guaranteed!</p>
<br />
<h2>Search page</h2>
<p>The Search page is the main event (“pp,” by the way is presented as “Prodigium”).  It is slightly confusing because the data is slightly confusing.  A contact might or might not be “Cinema of Change,” for example, but must (should) have a gender.  There has not been any attempt at distinguishing between “must have” criteria and “may have” ones.</p>
<p>Anyway, the first box is a “Select one” function, meaning the search definition will start with only one of these categories.  As we will see, some criteria can be combined with an “or,” and “and” can also be used.
For example, if we pick Prodigium off the first list and hit Select, a Prodigium subcategory box comes up and allows you to pick one or more subcategories (use CTRL+click to choose more than one)  for the search.  If you pick only one, a sub-sub-category box appears, but if you pick more than one it does not (sub-sub-categories of “actor” OR “attitude,” for example, wouldn’t make sense).  Also, below this box will now be buttons for:</p>
<ul>
<li>Select – confirms the selection of one or more sub-categories.  If you hit Select the “Search for:” string above the box will be updated to show the current search.  The string will show, for example, “Prodigium _ actor OR artist.”  The “_” means “with sub-category” (or sub-sub-category). </li>
<li>AND – allows you to perform a search for the existing category AND another.  For example, “Prodigium _ actor” AND “gender _ woman.”</li>
<li>Search – performs a search using the “Search for:” strings.  Note that if you have clicked on one more categories in the current list, but haven’t clicked Select, those categories will NOT be included in the search.</li>
<li>Start over – restart the search process.</li>
</ul>
<p>When you hit Search a list of names will come up, with the number found indicated.  You can scroll through the list and pick one.  Which will provide a box with the contact’s picture, basic information, a link to his/her Full Contact page, and a list of the categories attached to this contact.  The categories are indented to show hierarchy.</p>
<p>Clicking on one of the categories will do nothing if that category was already included in the search (e.g. you selected “Prodigium actor old” and then click on “actor.”  If the category was not included in the search it will be highlighted, and a button will appear below the category list that says “Refine search (x),” where x is the number of members that will show up on the list if you click the button.  If you would like to know, for example, how many contacts would show up if you narrowed you search by choosing “location USA,” just click USA.  The Refine search button will always give a count of at least one, because the currently displayed contact will always be included.  For refining a search, you only need to select a single tag.  The “parent” tags will automatically be included.</p>
</div>
</div>
      )
    }
}
