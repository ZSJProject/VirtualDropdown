var data = [{
		"id": "a0",
		"caption": "전국",
		"list": null
	},
	{
		"id": "a1",
		"caption": "서울",
	},
	{
		"id": "a101",
		"parent": "a1",
		"caption": "소계(도심지역)"
	},
	{
		"id": "a10101",
		"parent": "a101",
		"caption": "광화문",
		"list": null
	},
	{
		"id": "a10102",
		"parent": "a101",
		"caption": "동대문",
		"list": null
	},
	{
		"id": "a10103",
		"parent": "a101",
		"caption": "명동",
		"list": null
	},
	{
		"id": "a10104",
		"parent": "a101",
		"caption": "서울역",
		"list": null
	},
	{
		"id": "a10105",
		"parent": "a101",
		"caption": "종로",
		"list": null
	},
	{
		"id": "a10106",
		"parent": "a101",
		"caption": "충무로",
		"list": null
	}
];
/*

		"list": [{
				"name": "a101",
				"caption": "소계(도심지역)",
				"list": [{
						"name": "a10101",
						"caption": "광화문",
						"list": null
					},
					{
						"name": "a10102",
						"caption": "동대문",
						"list": null
					},
					{
						"name": "a10103",
						"caption": "명동",
						"list": null
					},
					{
						"name": "a10104",
						"caption": "서울역",
						"list": null
					},
					{
						"name": "a10105",
						"caption": "종로",
						"list": null
					},
					{
						"name": "a10106",
						"caption": "충무로",
						"list": null
					}
				]
			},
			{
				"name": "a102",
				"caption": "소계(강남지역)",
				"list": [{
						"name": "a10201",
						"caption": "강남대로",
						"list": null
					},
					{
						"name": "a10202",
						"caption": "도산대로",
						"list": null
					},
					{
						"name": "a10203",
						"caption": "서초",
						"list": null
					},
					{
						"name": "a10204",
						"caption": "신사",
						"list": null
					},
					{
						"name": "a10205",
						"caption": "압구정",
						"list": null
					},
					{
						"name": "a10206",
						"caption": "청담",
						"list": null
					},
					{
						"name": "a10207",
						"caption": "테헤란로",
						"list": null
					}
				]
			},
			{
				"name": "a103",
				"caption": "소계(신촌마포지역)",
				"list": [{
						"name": "a10301",
						"caption": "공덕역",
						"list": null
					},
					{
						"name": "a10302",
						"caption": "신촌",
						"list": null
					},
					{
						"name": "a10303",
						"caption": "홍대합정",
						"list": null
					}
				]
			},
			{
				"name": "a104",
				"caption": "소계(기타지역)",
				"list": [{
						"name": "a10401",
						"caption": "건대입구",
						"list": null
					},
					{
						"name": "a10402",
						"caption": "경희대",
						"list": null
					},
					{
						"name": "a10403",
						"caption": "군자",
						"list": null
					},
					{
						"name": "a10404",
						"caption": "목동",
						"list": null
					},
					{
						"name": "a10405",
						"caption": "사당",
						"list": null
					},
					{
						"name": "a10406",
						"caption": "성신여대",
						"list": null
					},
					{
						"name": "a10407",
						"caption": "수유",
						"list": null
					},
					{
						"name": "a10408",
						"caption": "신림",
						"list": null
					},
					{
						"name": "a10409",
						"caption": "영등포",
						"list": null
					},
					{
						"name": "a10410",
						"caption": "용산",
						"list": null
					},
					{
						"name": "a10411",
						"caption": "이태원",
						"list": null
					},
					{
						"name": "a10412",
						"caption": "잠실",
						"list": null
					},
					{
						"name": "a10413",
						"caption": "장안동",
						"list": null
					},
					{
						"name": "a10414",
						"caption": "천호",
						"list": null
					},
					{
						"name": "a10415",
						"caption": "청량리",
						"list": null
					},
					{
						"name": "a10416",
						"caption": "혜화동",
						"list": null
					},
					{
						"name": "a10417",
						"caption": "화곡",
						"list": null
					}
				]
			}
		]
	},
	{
		"name": "a2",
		"caption": "부산",
		"list": [{
				"name": "a20101",
				"caption": "경성대/부경대",
				"list": null
			},
			{
				"name": "a20102",
				"caption": "광안리",
				"list": null
			},
			{
				"name": "a20103",
				"caption": "동래역",
				"list": null
			},
			{
				"name": "a20104",
				"caption": "부산대학앞",
				"list": null
			},
			{
				"name": "a20105",
				"caption": "부산역",
				"list": null
			},
			{
				"name": "a20106",
				"caption": "서면",
				"list": null
			},
			{
				"name": "a20107",
				"caption": "연산로터리",
				"list": null
			},
			{
				"name": "a20108",
				"caption": "온천장",
				"list": null
			},
			{
				"name": "a20109",
				"caption": "중구시장",
				"list": null
			},
			{
				"name": "a20110",
				"caption": "해운대",
				"list": null
			},
			{
				"name": "a20111",
				"caption": "현대백화점주변",
				"list": null
			}
		]
	},
	{
		"name": "a3",
		"caption": "대구",
		"list": [{
				"name": "a30101",
				"caption": "계명대",
				"list": null
			},
			{
				"name": "a30102",
				"caption": "동성로",
				"list": null
			},
			{
				"name": "a30103",
				"caption": "범어",
				"list": null
			},
			{
				"name": "a30104",
				"caption": "상인월배",
				"list": null
			},
			{
				"name": "a30105",
				"caption": "수성",
				"list": null
			},
			{
				"name": "a30106",
				"caption": "시지지구",
				"list": null
			},
			{
				"name": "a30107",
				"caption": "죽전",
				"list": null
			},
			{
				"name": "a30108",
				"caption": "칠곡",
				"list": null
			}
		]
	},
	{
		"name": "a4",
		"caption": "인천",
		"list": [{
				"name": "a40101",
				"caption": "계양구",
				"list": null
			},
			{
				"name": "a40102",
				"caption": "구월간석",
				"list": null
			},
			{
				"name": "a40103",
				"caption": "부평",
				"list": null
			},
			{
				"name": "a40104",
				"caption": "주안",
				"list": null
			}
		]
	},
	{
		"name": "a5",
		"caption": "광주",
		"list": [{
				"name": "a50101",
				"caption": "금남로/충장로",
				"list": null
			},
			{
				"name": "a50102",
				"caption": "금호지구",
				"list": null
			},
			{
				"name": "a50103",
				"caption": "봉선동",
				"list": null
			},
			{
				"name": "a50104",
				"caption": "상무지구",
				"list": null
			},
			{
				"name": "a50105",
				"caption": "전남대",
				"list": null
			},
			{
				"name": "a50106",
				"caption": "첨단지구",
				"list": null
			}
		]
	},
	{
		"name": "a6",
		"caption": "대전",
		"list": [{
				"name": "a60101",
				"caption": "노은",
				"list": null
			},
			{
				"name": "a60102",
				"caption": "둔산",
				"list": null
			},
			{
				"name": "a60103",
				"caption": "복합터미널",
				"list": null
			},
			{
				"name": "a60104",
				"caption": "서대전네거리",
				"list": null
			},
			{
				"name": "a60105",
				"caption": "원도심",
				"list": null
			},
			{
				"name": "a60106",
				"caption": "유성온천역",
				"list": null
			}
		]
	},
	{
		"name": "a7",
		"caption": "울산",
		"list": [{
				"name": "a70101",
				"caption": "삼산동",
				"list": null
			},
			{
				"name": "a70102",
				"caption": "성남옥교동",
				"list": null
			},
			{
				"name": "a70103",
				"caption": "신정동",
				"list": null
			},
			{
				"name": "a70104",
				"caption": "전하동",
				"list": null
			}
		]
	},
	{
		"name": "b1",
		"caption": "경기",
		"list": [{
				"name": "b10101",
				"caption": "광명",
				"list": null
			},
			{
				"name": "b10102",
				"caption": "모란",
				"list": null
			},
			{
				"name": "b10103",
				"caption": "부천역",
				"list": null
			},
			{
				"name": "b10104",
				"caption": "분당",
				"list": null
			},
			{
				"name": "b10105",
				"caption": "상중동",
				"list": null
			},
			{
				"name": "b10106",
				"caption": "수원역",
				"list": null
			},
			{
				"name": "b10107",
				"caption": "수지",
				"list": null
			},
			{
				"name": "b10108",
				"caption": "안양1번지",
				"list": null
			},
			{
				"name": "b10109",
				"caption": "의정부역",
				"list": null
			},
			{
				"name": "b10110",
				"caption": "인계동",
				"list": null
			}
		]
	},
	{
		"name": "b2",
		"caption": "강원",
		"list": [{
				"name": "b20101",
				"caption": "강릉",
				"list": null
			},
			{
				"name": "b20102",
				"caption": "원주",
				"list": null
			},
			{
				"name": "b20103",
				"caption": "춘천",
				"list": null
			}
		]
	},
	{
		"name": "b3",
		"caption": "충북",
		"list": [{
				"name": "b30101",
				"caption": "청주",
				"list": null
			},
			{
				"name": "b30102",
				"caption": "충주",
				"list": null
			}
		]
	},
	{
		"name": "b4",
		"caption": "충남",
		"list": [{
				"name": "b40101",
				"caption": "서산",
				"list": null
			},
			{
				"name": "b40102",
				"caption": "아산",
				"list": null
			},
			{
				"name": "b40103",
				"caption": "천안",
				"list": null
			}
		]
	},
	{
		"name": "b5",
		"caption": "전북",
		"list": [{
				"name": "b50101",
				"caption": "군산",
				"list": null
			},
			{
				"name": "b50102",
				"caption": "익산",
				"list": null
			},
			{
				"name": "b50103",
				"caption": "전주",
				"list": null
			}
		]
	},
	{
		"name": "b6",
		"caption": "전남",
		"list": [{
				"name": "b60101",
				"caption": "광양",
				"list": null
			},
			{
				"name": "b60102",
				"caption": "목포",
				"list": null
			},
			{
				"name": "b60103",
				"caption": "순천",
				"list": null
			},
			{
				"name": "b60104",
				"caption": "여수",
				"list": null
			}
		]
	},
	{
		"name": "b7",
		"caption": "경북",
		"list": [{
				"name": "b70101",
				"caption": "구미",
				"list": null
			},
			{
				"name": "b70102",
				"caption": "안동",
				"list": null
			},
			{
				"name": "b70103",
				"caption": "포항",
				"list": null
			}
		]
	},
	{
		"name": "b8",
		"caption": "경남",
		"list": [{
				"name": "b80101",
				"caption": "거제",
				"list": null
			},
			{
				"name": "b80102",
				"caption": "김해",
				"list": null
			},
			{
				"name": "b80103",
				"caption": "양산",
				"list": null
			},
			{
				"name": "b80104",
				"caption": "진주",
				"list": null
			},
			{
				"name": "b80105",
				"caption": "창원",
				"list": null
			}
		]
	},
	{
		"name": "b9",
		"caption": "제주",
		"list": [{
			"name": "b90101",
			"caption": "제주",
			"list": null
		}]
	}
]*/