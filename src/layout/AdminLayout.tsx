
import AdminSideBar from '../components/AdminSideBar/AdminSideBar'
import { Outlet } from 'react-router-dom'
import { pentaluxeTheme } from '@/theme'

const AdminLayout = () => {
  return (
    <div 
      className="flex min-h-screen font-sans selection:bg-emerald-500 selection:text-black"
      style={{ backgroundColor: pentaluxeTheme.background, color: pentaluxeTheme.foreground }}
    >
      <AdminSideBar />
      
      <main className="flex-grow ml-[18%] p-8 min-h-screen overflow-y-auto scrollbar-hide">
        <div className="max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout