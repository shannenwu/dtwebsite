const showMap = {
  'S19': {
    name: 'beDTime',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLZ7FwvI8aqZP2lorAKdodJAgFvJTAj3_r',
    dances: [
      {
        name: 'Daphne Lin, Wings Yeung',
        style: 'Contemporary',
        level: 'Beginner',
        description: 'A really fun, upbeat dance and a great way to learn contemp! When I’m with you, I’m standing with an army. You could be in that army! Join us for our last semester of choreographing.',
        videoUrl: 'https://www.youtube.com/watch?v=_ePvWm-mOSU&index=2&t=0s&list=PLZ7FwvI8aqZP2lorAKdodJAgFvJTAj3_r'
      },
      {
        name: 'Jessie Wang, Jennifer Wang, Lisa Peng, Mia San Gabriel',
        style: 'Fusion',
        level: 'Intermediate/Advanced',
        description: 'About struggling with unequal relationships and learning to move on – there will be partner choreo and contrasting textures, overall a very angsty vibe. Looking for both contemp and hip hop dancers, plus dancers who want to learn new styles!',
        videoUrl: 'https://www.youtube.com/watch?v=gRX23TBeOHE&list=PLZ7FwvI8aqZP2lorAKdodJAgFvJTAj3_r&index=4'
      },
      {
        name: 'Jami',
        style: 'Contemporary',
        level: 'Advanced',
        description: 'Gonna be kind of intense but groovy. Want 50/50 guys and girls. Will probably be some partner work. I think its going to be about the different stages of toxic relationships. Will be a mix of smooth and harder hitting choreography.',
        videoUrl: 'https://www.youtube.com/watch?v=R-iBOdHFA_w&index=3&list=PLZ7FwvI8aqZP2lorAKdodJAgFvJTAj3_r'
      },
      {
        name: 'Claudia Chen, Andrea Garmilla, Michelle Huang, Patricia Lu',
        style: 'Contemporary',
        level: 'All Levels',
        description: 'This dance is going to be HAPPY. We are going to have a GREAT TIME.',
        videoUrl: 'https://www.youtube.com/watch?v=jOaA7Vn7wps&index=2&list=PLZ7FwvI8aqZP2lorAKdodJAgFvJTAj3_r'
      },
      {
        name: 'Elisabeth Bullock',
        style: 'Ballet',
        level: 'Intermediate/Advanced',
        description: 'About finding satisfaction in reminiscing in past memories but being unable to be completely in the present. Generally very upbeat but with slower, more melty parts. Potentially includes some not-entirely-ballet things like fan kicks and some random turned in stuff. :)',
        videoUrl: 'https://www.youtube.com/watch?v=EgM8L-xfxbk&list=PLZ7FwvI8aqZP2lorAKdodJAgFvJTAj3_r&index=6'
      },
      {
        name: 'Xochitl Luna',
        style: 'Tap',
        level: 'Advanced',
        description: 'Imagine your most boisterous, outgoing friend was moving away. You’d HAVE to throw them a goodbye party, right? And of course it would be SUPER fun, SUPER loud, and SUPER high-energy. That’s this dance. (Broadway flavor/some rhythm tap steps)',
        videoUrl: 'https://www.youtube.com/watch?v=d6D4OxY48dA&index=7&list=PLZ7FwvI8aqZP2lorAKdodJAgFvJTAj3_r'
      },
      {
        name: 'Miki Hansen, Shannen Wu',
        style: 'Hip Hop',
        level: 'Beginner',
        description: 'A dance encapsulating a lot of moods, from angsty to fierce to happy. About the general relationship cycle of a break-up into new beginnings.',
        videoUrl: 'https://www.youtube.com/watch?v=wte_mkb7dRs&index=8&list=PLZ7FwvI8aqZP2lorAKdodJAgFvJTAj3_r'
      },
      {
        name: 'Tom Benavides, Michael Mandanas, Matt Tung, Amber Zheng',
        style: 'Hip Hop',
        level: 'Beginner/Intermediate',
        description: 'It\'s a Battle of the Ages. Young vs. Old, Classic vs Modern, who knows, I don’t.',
        videoUrl: 'https://www.youtube.com/watch?v=PBF_QFPz4l4&list=PLZ7FwvI8aqZP2lorAKdodJAgFvJTAj3_r&index=9'
      },
      {
        name: 'Anthony Rosario, Caela Gomes',
        style: 'Hip Hop',
        level: 'Intermediate/Advanced',
        description: 'A lot of these songs in this dance give the feeling of “I got it” so we’re gonna follow this feeling all semester.',
        videoUrl: 'https://drive.google.com/file/d/1drf_8Y7mmpIvcs1inr8Z6-MTFqirY_Qa/view?usp=sharing'
      },
      {
        name: 'Ramya Durvasala, Faraaz Nadeem',
        style: 'Lyrical',
        level: 'Intermediate/Advanced',
        description: 'This piece is about two siblings, and what happens when the older sibling goes to college. We want to convey that college can be really exciting, but at the same time, it can be easy to forget about home and the people who miss you.',
        videoUrl: 'https://www.youtube.com/watch?v=_0LfgRGPFWg&index=12&list=PLZ7FwvI8aqZP2lorAKdodJAgFvJTAj3_r'
      },
      {
        name: 'Thad Daguilh',
        style: 'Hip Hop',
        level: 'Advanced',
        description: 'This piece is going to be challenging but in a good way. It’s about bringing back the EDM flavor to our dance community with each song targeting a different aspect of the genre. Come thru if you want to push yourself and step out of your comfort zone.',
        videoUrl: 'https://www.youtube.com/watch?v=9dP3Q5ZUYnE&index=14&list=PLZ7FwvI8aqZP2lorAKdodJAgFvJTAj3_r'
      },
      {
        name: 'Jade Ishii, Afura Taylor, Avital Weinberg',
        style: 'Hip Hop (femme)',
        level: 'All Levels',
        description: 'This dance will be fierce, sassy, and HOT with elements of vogue femme and heels (we aren\'t actually wearing heels though). We want to slay this dance like the QUEENS that slay these songs.',
        videoUrl: 'https://www.youtube.com/watch?v=RdV_Tw64WJA&list=PLZ7FwvI8aqZP2lorAKdodJAgFvJTAj3_r&index=10'
      },
      {
        name: 'Taylor Herr, Claire Nobuhara, Kai Xiao',
        style: 'Hip Hop',
        level: 'All Levels',
        description: 'Everything wrong with millennials. Come have a stupid good time.',
        videoUrl: 'https://www.youtube.com/watch?v=ZMzcB5SWT0Y&list=PLZ7FwvI8aqZP2lorAKdodJAgFvJTAj3_r&index=11'
      },
    ]
  },
  'F18': {
    name: 'DT Do You Love Me?',
    playlistUrl: 'https://www.youtube.com/watch?v=q4I7BvnU5NI&list=PLZ7FwvI8aqZPZFk_eD7dBltPFP-xwn_Pb',
    dances: [
      {
        name: 'Daphne Lin, Wings Yeung',
        style: 'Contemporary',
        level: 'Beginner',
        description: 'A pretty, floaty, fun, happy, feels good dance. Lots of energy but also lots of elegance. You know, because we’re classy people.',
        videoUrl: 'https://www.youtube.com/watch?v=q4I7BvnU5NI&index=1&list=PLZ7FwvI8aqZPZFk_eD7dBltPFP-xwn_Pb'
      },
    ]
  }
}

module.exports = {
  showMap
};