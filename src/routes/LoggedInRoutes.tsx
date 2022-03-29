import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

import Summary from '../views/app/Summary';
import Subjects from '../views/app/Subjects';
import Marks from '../views/app/Marks';
import Students from '../views/app/Students';
import Absences from '../views/app/Absences';
import Internships from '../views/app/Internships';
import Accounting from '../views/app/Accounting';
import Admin from '../views/app/Admin';
import Tools from '../views/app/Tools';
import Settings from '../views/app/Settings';
import Drawer from '../views/shared/Drawer';

import { getLoggedInAuthState, getUserCategories } from '../shared/functions';
import { values } from '../shared/utils';


const LoggedInRoutes: FC = () => {
  const { user } = useSelector(getLoggedInAuthState);

  const components: {[key: string]: JSX.Element} = {
    summary: <Summary/>,
    subjects: <Subjects/>,
    marks: <Marks/>,
    students: <Students/>,
    absences: <Absences/>,
    internships: <Internships/>,
    accounting: <Accounting/>,
    admin: <Admin/>,
    tools: <Tools/>
  };


  return (
    <div className="app">
      <Drawer/>

      <div className="app__content">
        <Routes>
          {getUserCategories(values.categories, user).map(category => (
            <Route key={category} path={'/' + category} element={components[category]}/>
          ))}

          <Route path="/settings" element={<Settings/>}/>

          {/* Redirect to the home page if the route doesn't exist */}
          <Route path="*" element={<Navigate replace to="/summary"/>}/>
        </Routes>
      </div>
    </div>
);
};


export default LoggedInRoutes;
