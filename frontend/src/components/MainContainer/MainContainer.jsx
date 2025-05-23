import { useScreenSize } from '~/hooks/useEffect'
import { useLayoutContext } from '~/hooks/useContext'
import Box from '@mui/material/Box'

export default function MainContainer({ children }) {
  const sidebarScreenSizeThreshold = 800

  const { openSidebar, lockSidebar, sidebarMounted } = useLayoutContext()
  const screenWidth = useScreenSize()

  return (
    <Box
      sx={(theme) => ({
        flexGrow: 1,
        transition: sidebarMounted
          ? theme.transitions.create('margin', {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard
            })
          : 'none',
        marginLeft:
          (openSidebar || lockSidebar) &&
          screenWidth > sidebarScreenSizeThreshold
            ? theme.sideBar.width.open
            : (openSidebar || lockSidebar) &&
              screenWidth <= sidebarScreenSizeThreshold
            ? 0
            : !openSidebar &&
              !lockSidebar &&
              screenWidth > sidebarScreenSizeThreshold
            ? theme.sideBar.width.close
            : 0
      })}
    >
      {children}
    </Box>
  )
}
