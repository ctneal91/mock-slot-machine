namespace :frontend do
  desc "Build React frontend and copy to public folder"
  task :build do
    puts "Building React frontend..."
    frontend_dir = Rails.root.join("frontend")

    Dir.chdir(frontend_dir) do
      system("npm install") || raise("npm install failed")
      system("npm run build") || raise("npm run build failed")
    end

    puts "Copying build to public folder..."
    build_dir = frontend_dir.join("build")
    public_dir = Rails.root.join("public")

    # Remove old frontend files (but keep Rails defaults)
    FileUtils.rm_rf(Dir.glob("#{public_dir}/static"))
    FileUtils.rm_f("#{public_dir}/index.html")
    FileUtils.rm_f("#{public_dir}/asset-manifest.json")
    FileUtils.rm_f("#{public_dir}/manifest.json")

    # Copy new build
    FileUtils.cp_r("#{build_dir}/.", public_dir)

    puts "Frontend build complete!"
  end
end
