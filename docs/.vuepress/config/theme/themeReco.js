module.exports = {
  type: 'blog',
  // 博客设置
  blogConfig: {
    category: {
      location: 2, // 在导航栏菜单中所占的位置，默认2
      text: 'Category' // 默认 “分类”
    },
    tag: {
      location: 3, // 在导航栏菜单中所占的位置，默认3
      text: 'Tag' // 默认 “标签”
    }
  },
  friendLink: [
      {
        title: '广慕君',
        desc: '成为一个快乐、富有、优秀的人，不以物喜，不以己悲。',
        email: 'wyh_nanjing@163.com',
        link: 'https://guangmujun.github.io'
      },
      {
        title: '虚位以待',
        desc: 'A simple and beautiful',
        // avatar: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        link: 'https://guangmujun.github.io'
      },
  ],
  logo: '/favicon.jpg', 
  // 最后更新时间
  lastUpdated: 'Last Updated', // string | boolean
  // 作者
  author: '广慕君',
  // 备案号
  record: '广慕君',
  recordLink: 'https://guangmujun.github.io',
  // 项目开始时间
  startYear: '2022'
}
