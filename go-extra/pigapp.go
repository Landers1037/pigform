package main

// 单文件 用于启动pigform的后端服务器
import (
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

const (
	OK = "ok"
	BAD = "bad"
)

// 启动端口来自命令行 默认使用5000
func newServer(port string) {
	log(fmt.Sprintf("服务运行于 %s", port))
	router := gin.Default()
	gin.DisableConsoleColor()
	gin.DefaultWriter = io.MultiWriter(logFile)
	router.Use(func(c *gin.Context) {
		method := c.Request.Method
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		//服务器支持的所有跨域请求的方法
		c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE,UPDATE")
		//允许跨域设置可以返回其他子段，可以自定义字段
		c.Header("Access-Control-Allow-Headers", "Authorization, Content-Length, X-CSRF-Token, Token,session, Content-Type")
		// 允许浏览器（客户端）可以解析的头部 （重要）
		c.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers")
		//允许客户端传递校验信息比如 cookie (重要)
		c.Header("Access-Control-Allow-Credentials", "true")
		if method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
		}
	})
	api := router.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			// 健康检查
			c.JSON(200, gin.H{"data": ""})
		})

		api.GET("/data", func(c *gin.Context) {
			// 获取数据
			id := c.Query("id")
			fmt.Println(id)
			if id != "" {
				var res model
				id2int, _ := strconv.Atoi(id)
				fmt.Println(id2int)
				if DB.Model(&model{}).Where("id = ?", id2int).First(&res).Error != nil {
					c.JSON(200, gin.H{"data": BAD})
					return
				}
				c.JSON(200, gin.H{"data": res})
				return
			}
			var res []model
			if DB.Model(&model{}).Order("id desc").Find(&res).Error != nil {
				c.JSON(200, gin.H{"data": res})
				return
			}
			c.JSON(200, gin.H{"data": res})
		})

		api.POST("/add", func(c *gin.Context) {
			// 增加数据
			// 区分复制
			var d model
			now := time.Now().Format("15:04:05")
			if e := c.BindJSON(&d); e != nil {
				c.JSON(200, gin.H{"data": BAD})
				return
			}
			if d.ID != 0 {
				d.ID = 0
			}

			d.Time = now
			err := DB.Model(&model{}).Create(&d).Error
			if err != nil {
				c.JSON(200, gin.H{"data": BAD})
				return
			}
			c.JSON(200, gin.H{"data": OK})
		})

		api.POST("/del", func(c *gin.Context) {
			// 删除数据
			id := c.Query("id")
			if id == "" {
				c.JSON(200, gin.H{"data": BAD})
				return
			}
			id2int, _ := strconv.Atoi(id)
			if err := DB.Model(&model{}).Delete(model{ID: id2int}).Error; err != nil {
				log("数据删除失败", err.Error())
				c.JSON(200, gin.H{"data": BAD})
				return
			}
			c.JSON(200, gin.H{"data": OK})
			return
		})

		api.POST("/edit", func(c *gin.Context) {
			// 编辑数据 不能存在空数据否则会失败
			var data model
			err := c.BindJSON(&data)
			if err != nil {
				c.JSON(200, gin.H{"data": BAD})
				return
			}

			if err := DB.Model(&model{}).Updates(data); err != nil {
				c.JSON(200, gin.H{"data": BAD})
				return
			}
			c.JSON(200, gin.H{"data": OK})
			return
		})

		api.GET("/se", func(c *gin.Context) {
			// 搜索
			con := c.Query("condition")
			data := c.Query("data")
			var res []model
			if con == "" || data == "" {
				c.JSON(200, gin.H{"data": res})
				return
			}
			if err := DB.Model(&model{}).Where(
				fmt.Sprintf("%s like ?", con),
				fmt.Sprintf("%%%s%%", data)).Debug().Find(&res).Error; err != nil {
				log("数据查询错误", err.Error())
				c.JSON(200, gin.H{"data": res})
				return
			}
			c.JSON(200, gin.H{"data": res})
		})

		api.GET("/info", func(c *gin.Context) {
			// 数据库信息
			var count int
			var size int64
			DB.Model(&model{}).Count(&count)
			info, err := os.Stat(dbPath)
			if err != nil {
				size = 0
			} else {
				size = info.Size() / 1024
			}

			c.JSON(200, gin.H{
				"count": count,
				"size": size,
				"path": dbPath,
			})
			return
		})
	}
	_ = router.Run(fmt.Sprintf(":%s", port))
}

// 日志
var logFile *os.File
var homeDir, _ = os.UserHomeDir()
var dbPath = path.Join(homeDir, "pig.db")

func openLog() {
	var e error
	logFile, e = os.Create(path.Join(homeDir, "pigform-go.log"))
	if e != nil {
		return
	}
}

func log(args ...interface{}) {
	fmt.Fprintf(logFile, "[PIGFORM]: %v\n", args)
}

// 数据库模型
type model struct {
	ID int `json:"id" gorm:"primary_key"`
	Date string `json:"date"`
	Time string `json:"time"`
	Name string `json:"name"`
	Sex string `json:"sex"`
	Age string `json:"age"`
	Illtime string `json:"illtime"`
	Phone string `json:"phone"`
	Parent string `json:"parent"`
	Work string `json:"work"`
	Address string `json:"address"`
	Detail string `json:"detail"`
	Solution string `json:"solution"`
	Addon string `json:"addon"`
	Money string `json:"money"`
	Doc string `json:"doc"`
}

func (model) TableName() string {
	return "pig"
}

var DB *gorm.DB

// 数据库操作层
func openDB() (*gorm.DB, error) {
	log(fmt.Sprintf("数据库文件路径 %s", dbPath))
	return gorm.Open("sqlite3", dbPath)
}

// 初始化表
func initTable() {
	if e := DB.CreateTable(&model{}).Error; e != nil {
		log("数据库表创建失败", e.Error())
	}
}

func main() {
	port := flag.String("port", "5000", "running port")
	flag.Parse()
	openLog()

	var err error
	DB, err = openDB()
	initTable()
	if err != nil {
		log("打开数据库文件失败", err.Error())
		return
	}

	newServer(*port)
}